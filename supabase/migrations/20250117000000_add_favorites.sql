-- Add is_favorite column to videos table
ALTER TABLE videos ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;

-- Create index for faster queries on favorites
CREATE INDEX IF NOT EXISTS idx_videos_is_favorite ON videos(user_id, is_favorite) WHERE is_favorite = TRUE;

-- Add comment
COMMENT ON COLUMN videos.is_favorite IS 'Indicates if the video is marked as favorite by the user';
