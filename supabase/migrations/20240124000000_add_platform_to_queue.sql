-- Add platform column to video_queue for separate processing
ALTER TABLE video_queue 
ADD COLUMN IF NOT EXISTS platform TEXT DEFAULT 'unknown' CHECK (platform IN ('youtube', 'instagram', 'other', 'unknown'));

-- Create index for platform-based queries
CREATE INDEX IF NOT EXISTS idx_video_queue_platform_status ON video_queue(platform, status, priority DESC, created_at ASC);

-- Function to detect platform from URL
CREATE OR REPLACE FUNCTION detect_platform(video_url TEXT)
RETURNS TEXT AS $$
BEGIN
  IF video_url LIKE '%youtube.com%' OR video_url LIKE '%youtu.be%' THEN
    RETURN 'youtube';
  ELSIF video_url LIKE '%instagram.com%' THEN
    RETURN 'instagram';
  ELSE
    RETURN 'other';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update existing queue items with platform
UPDATE video_queue vq
SET platform = detect_platform(v.url)
FROM videos v
WHERE vq.video_id = v.id
AND vq.platform = 'unknown';

-- Function to get next video from queue by platform
CREATE OR REPLACE FUNCTION get_next_from_queue(p_platform TEXT DEFAULT NULL)
RETURNS TABLE (
  id UUID,
  video_id UUID,
  user_id UUID,
  platform TEXT,
  attempts INTEGER,
  max_attempts INTEGER
) AS $$
BEGIN
  IF p_platform IS NULL THEN
    -- Get from any platform, prioritizing YouTube (faster)
    RETURN QUERY
    SELECT 
      vq.id,
      vq.video_id,
      vq.user_id,
      vq.platform,
      vq.attempts,
      vq.max_attempts
    FROM video_queue vq
    WHERE vq.status = 'pending'
    ORDER BY 
      CASE vq.platform 
        WHEN 'youtube' THEN 1
        WHEN 'instagram' THEN 2
        ELSE 3
      END,
      vq.priority DESC,
      vq.created_at ASC
    LIMIT 1;
  ELSE
    -- Get from specific platform
    RETURN QUERY
    SELECT 
      vq.id,
      vq.video_id,
      vq.user_id,
      vq.platform,
      vq.attempts,
      vq.max_attempts
    FROM video_queue vq
    WHERE vq.status = 'pending'
    AND vq.platform = p_platform
    ORDER BY vq.priority DESC, vq.created_at ASC
    LIMIT 1;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION detect_platform(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_next_from_queue(TEXT) TO authenticated;

-- Update get_queue_position to consider platform
CREATE OR REPLACE FUNCTION get_queue_position(p_video_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_position INTEGER;
  v_created_at TIMESTAMP WITH TIME ZONE;
  v_priority INTEGER;
  v_platform TEXT;
BEGIN
  -- Get the created_at, priority and platform of the video
  SELECT vq.created_at, vq.priority, vq.platform 
  INTO v_created_at, v_priority, v_platform
  FROM video_queue vq
  WHERE vq.video_id = p_video_id AND vq.status = 'pending';
  
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  
  -- Count how many videos are ahead in the queue (same platform)
  SELECT COUNT(*) + 1 INTO v_position
  FROM video_queue
  WHERE status = 'pending'
    AND platform = v_platform
    AND (
      priority > v_priority
      OR (priority = v_priority AND created_at < v_created_at)
    );
  
  RETURN v_position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment
COMMENT ON COLUMN video_queue.platform IS 'Platform of the video (youtube, instagram, other) for separate queue processing';
