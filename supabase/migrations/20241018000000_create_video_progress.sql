-- Tabela para controlar o progresso de visualização dos vídeos
CREATE TABLE IF NOT EXISTS public.video_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  watched_time NUMERIC NOT NULL DEFAULT 0,
  duration NUMERIC,
  progress_percentage NUMERIC GENERATED ALWAYS AS (
    CASE 
      WHEN duration > 0 THEN (watched_time / duration * 100)
      ELSE 0
    END
  ) STORED,
  completed BOOLEAN DEFAULT FALSE,
  last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Garantir que cada usuário tenha apenas um registro por vídeo
  UNIQUE(user_id, video_id)
);

-- Índices para melhorar performance
CREATE INDEX idx_video_progress_user_id ON public.video_progress(user_id);
CREATE INDEX idx_video_progress_video_id ON public.video_progress(video_id);
CREATE INDEX idx_video_progress_last_watched ON public.video_progress(last_watched_at DESC);
CREATE INDEX idx_video_progress_completed ON public.video_progress(completed) WHERE completed = true;

-- RLS Policies
ALTER TABLE public.video_progress ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver apenas seu próprio progresso
CREATE POLICY "Users can view own video progress"
  ON public.video_progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- Usuários podem inserir seu próprio progresso
CREATE POLICY "Users can insert own video progress"
  ON public.video_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar seu próprio progresso
CREATE POLICY "Users can update own video progress"
  ON public.video_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem deletar seu próprio progresso
CREATE POLICY "Users can delete own video progress"
  ON public.video_progress
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_video_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_video_progress_updated_at_trigger
  BEFORE UPDATE ON public.video_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_video_progress_updated_at();

-- Comentários para documentação
COMMENT ON TABLE public.video_progress IS 'Armazena o progresso de visualização dos vídeos por usuário';
COMMENT ON COLUMN public.video_progress.watched_time IS 'Tempo atual em segundos onde o usuário parou';
COMMENT ON COLUMN public.video_progress.duration IS 'Duração total do vídeo em segundos';
COMMENT ON COLUMN public.video_progress.progress_percentage IS 'Percentual de progresso calculado automaticamente';
COMMENT ON COLUMN public.video_progress.completed IS 'Indica se o vídeo foi assistido completamente';
