-- Add tutorial_steps column to videos table
ALTER TABLE videos ADD COLUMN IF NOT EXISTS tutorial_steps TEXT;

-- Add is_tutorial flag
ALTER TABLE videos ADD COLUMN IF NOT EXISTS is_tutorial BOOLEAN DEFAULT FALSE;

-- Add comment
COMMENT ON COLUMN videos.tutorial_steps IS 'Step-by-step instructions if video is a tutorial';
COMMENT ON COLUMN videos.is_tutorial IS 'Indicates if the video is identified as a tutorial';
