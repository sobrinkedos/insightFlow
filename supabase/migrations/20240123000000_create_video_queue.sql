-- Create video_queue table for managing sequential video processing
CREATE TABLE IF NOT EXISTS video_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  priority INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(video_id)
);

-- Create index for efficient queue queries
CREATE INDEX IF NOT EXISTS idx_video_queue_status ON video_queue(status);
CREATE INDEX IF NOT EXISTS idx_video_queue_user_id ON video_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_video_queue_created_at ON video_queue(created_at);
CREATE INDEX IF NOT EXISTS idx_video_queue_priority_created ON video_queue(priority DESC, created_at ASC) WHERE status = 'pending';

-- Enable RLS
ALTER TABLE video_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own queue items"
  ON video_queue FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own queue items"
  ON video_queue FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own queue items"
  ON video_queue FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to get queue position
CREATE OR REPLACE FUNCTION get_queue_position(p_video_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_position INTEGER;
  v_created_at TIMESTAMP WITH TIME ZONE;
  v_priority INTEGER;
BEGIN
  -- Get the created_at and priority of the video
  SELECT created_at, priority INTO v_created_at, v_priority
  FROM video_queue
  WHERE video_id = p_video_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  
  -- Count how many videos are ahead in the queue
  SELECT COUNT(*) + 1 INTO v_position
  FROM video_queue
  WHERE status = 'pending'
    AND (
      priority > v_priority
      OR (priority = v_priority AND created_at < v_created_at)
    );
  
  RETURN v_position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically clean old completed/failed items (older than 7 days)
CREATE OR REPLACE FUNCTION cleanup_old_queue_items()
RETURNS void AS $$
BEGIN
  DELETE FROM video_queue
  WHERE status IN ('completed', 'failed')
    AND completed_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_queue_position(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_queue_items() TO authenticated;
