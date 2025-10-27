-- ============================================================================
-- MIGRAÇÃO COMPLETA PARA PRODUÇÃO
-- Data: 2025-01-27
-- Origem: Banco de Desenvolvimento (insightDev)
-- Destino: Banco de Produção (insightProd)
-- 
-- INSTRUÇÕES:
-- 1. Acesse: https://supabase.com/dashboard/project/jropngieefxgnufmkeaj
-- 2. Vá em SQL Editor
-- 3. Cole este script completo
-- 4. Execute
-- ============================================================================

-- ============================================================================
-- TABELA: profiles
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    website TEXT,
    updated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- TABELA: videos
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT,
    channel TEXT,
    tags TEXT[],
    transcription TEXT,
    summary_short TEXT,
    summary_expanded TEXT,
    topics TEXT[],
    keywords TEXT[],
    category TEXT,
    subcategory TEXT,
    embedding vector(1536),
    status TEXT DEFAULT 'Processando' CHECK (status IN ('Processando', 'Concluído', 'Falha')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    processed_at TIMESTAMP WITH TIME ZONE,
    is_favorite BOOLEAN DEFAULT false,
    tutorial_steps TEXT,
    is_tutorial BOOLEAN DEFAULT false,
    manual_description TEXT,
    video_url TEXT,
    thumbnail_url TEXT
);

COMMENT ON COLUMN public.videos.status IS 'Status do processamento: Processando, Concluído, Falha';
COMMENT ON COLUMN public.videos.is_favorite IS 'Indicates if the video is marked as favorite by the user';
COMMENT ON COLUMN public.videos.tutorial_steps IS 'Step-by-step instructions if video is a tutorial';
COMMENT ON COLUMN public.videos.is_tutorial IS 'Indicates if the video is identified as a tutorial';
COMMENT ON COLUMN public.videos.manual_description IS 'Manual description provided by user for videos where automatic extraction fails (e.g., Instagram)';
COMMENT ON COLUMN public.videos.video_url IS 'Direct URL to the video file (especially for Instagram videos)';
COMMENT ON COLUMN public.videos.thumbnail_url IS 'Direct URL to the video thumbnail image';

-- Índices
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON public.videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON public.videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON public.videos(created_at DESC);

-- RLS
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Políticas
DROP POLICY IF EXISTS "Users can view own videos" ON public.videos;
CREATE POLICY "Users can view own videos" ON public.videos
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own videos" ON public.videos;
CREATE POLICY "Users can insert own videos" ON public.videos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own videos" ON public.videos;
CREATE POLICY "Users can update own videos" ON public.videos
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own videos" ON public.videos;
CREATE POLICY "Users can delete own videos" ON public.videos
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- TABELA: themes
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    consolidated_summary TEXT,
    keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON COLUMN public.themes.title IS 'Título do tema sempre em português, sem prefixo "Tema sobre"';

-- Índices
CREATE INDEX IF NOT EXISTS idx_themes_user_id ON public.themes(user_id);
CREATE INDEX IF NOT EXISTS idx_themes_created_at ON public.themes(created_at DESC);

-- RLS
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

-- Políticas
DROP POLICY IF EXISTS "Users can view own themes" ON public.themes;
CREATE POLICY "Users can view own themes" ON public.themes
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own themes" ON public.themes;
CREATE POLICY "Users can insert own themes" ON public.themes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own themes" ON public.themes;
CREATE POLICY "Users can update own themes" ON public.themes
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own themes" ON public.themes;
CREATE POLICY "Users can delete own themes" ON public.themes
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- TABELA: theme_videos (relação muitos-para-muitos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.theme_videos (
    theme_id UUID REFERENCES public.themes(id) ON DELETE CASCADE,
    video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
    PRIMARY KEY (theme_id, video_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_theme_videos_theme_id ON public.theme_videos(theme_id);
CREATE INDEX IF NOT EXISTS idx_theme_videos_video_id ON public.theme_videos(video_id);

-- RLS
ALTER TABLE public.theme_videos ENABLE ROW LEVEL SECURITY;

-- Políticas
DROP POLICY IF EXISTS "Users can view own theme_videos" ON public.theme_videos;
CREATE POLICY "Users can view own theme_videos" ON public.theme_videos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.themes
            WHERE themes.id = theme_videos.theme_id
            AND themes.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert own theme_videos" ON public.theme_videos;
CREATE POLICY "Users can insert own theme_videos" ON public.theme_videos
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.themes
            WHERE themes.id = theme_videos.theme_id
            AND themes.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete own theme_videos" ON public.theme_videos;
CREATE POLICY "Users can delete own theme_videos" ON public.theme_videos
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.themes
            WHERE themes.id = theme_videos.theme_id
            AND themes.user_id = auth.uid()
        )
    );

-- ============================================================================
-- TABELA: video_progress
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.video_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
    watched_time NUMERIC DEFAULT 0,
    duration NUMERIC,
    progress_percentage NUMERIC GENERATED ALWAYS AS (
        CASE
            WHEN duration > 0 THEN (watched_time / duration) * 100
            ELSE 0
        END
    ) STORED,
    completed BOOLEAN DEFAULT false,
    last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, video_id)
);

COMMENT ON TABLE public.video_progress IS 'Armazena o progresso de visualização dos vídeos por usuário';
COMMENT ON COLUMN public.video_progress.watched_time IS 'Tempo atual em segundos onde o usuário parou';
COMMENT ON COLUMN public.video_progress.duration IS 'Duração total do vídeo em segundos';
COMMENT ON COLUMN public.video_progress.progress_percentage IS 'Percentual de progresso calculado automaticamente';
COMMENT ON COLUMN public.video_progress.completed IS 'Indica se o vídeo foi assistido completamente';

-- Índices
CREATE INDEX IF NOT EXISTS idx_video_progress_user_id ON public.video_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_video_progress_video_id ON public.video_progress(video_id);
CREATE INDEX IF NOT EXISTS idx_video_progress_last_watched ON public.video_progress(last_watched_at DESC);

-- RLS
ALTER TABLE public.video_progress ENABLE ROW LEVEL SECURITY;

-- Políticas
DROP POLICY IF EXISTS "Users can view own progress" ON public.video_progress;
CREATE POLICY "Users can view own progress" ON public.video_progress
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON public.video_progress;
CREATE POLICY "Users can insert own progress" ON public.video_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON public.video_progress;
CREATE POLICY "Users can update own progress" ON public.video_progress
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own progress" ON public.video_progress;
CREATE POLICY "Users can delete own progress" ON public.video_progress
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- TABELA: video_queue
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.video_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID UNIQUE REFERENCES public.videos(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    priority INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    platform TEXT DEFAULT 'unknown' CHECK (platform IN ('youtube', 'instagram', 'other', 'unknown'))
);

COMMENT ON COLUMN public.video_queue.platform IS 'Platform of the video (youtube, instagram, other) for separate queue processing';

-- Índices
CREATE INDEX IF NOT EXISTS idx_video_queue_status ON public.video_queue(status);
CREATE INDEX IF NOT EXISTS idx_video_queue_priority ON public.video_queue(priority DESC);
CREATE INDEX IF NOT EXISTS idx_video_queue_platform ON public.video_queue(platform);
CREATE INDEX IF NOT EXISTS idx_video_queue_created_at ON public.video_queue(created_at);

-- RLS
ALTER TABLE public.video_queue ENABLE ROW LEVEL SECURITY;

-- Políticas
DROP POLICY IF EXISTS "Users can view own queue items" ON public.video_queue;
CREATE POLICY "Users can view own queue items" ON public.video_queue
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage queue" ON public.video_queue;
CREATE POLICY "Service role can manage queue" ON public.video_queue
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- FUNÇÕES E TRIGGERS
-- ============================================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para profiles
DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Trigger para themes
DROP TRIGGER IF EXISTS on_themes_updated ON public.themes;
CREATE TRIGGER on_themes_updated
    BEFORE UPDATE ON public.themes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Trigger para video_progress
DROP TRIGGER IF EXISTS on_video_progress_updated ON public.video_progress;
CREATE TRIGGER on_video_progress_updated
    BEFORE UPDATE ON public.video_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- EXTENSÕES
-- ============================================================================

-- Habilitar extensão vector para embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- MENSAGEM FINAL
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Migração concluída com sucesso!';
    RAISE NOTICE 'Tabelas criadas: profiles, videos, themes, theme_videos, video_progress, video_queue';
    RAISE NOTICE 'RLS habilitado em todas as tabelas';
    RAISE NOTICE 'Políticas de segurança aplicadas';
    RAISE NOTICE 'Triggers configurados';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Próximos passos:';
    RAISE NOTICE '1. Verificar se todas as tabelas foram criadas';
    RAISE NOTICE '2. Fazer deploy das Edge Functions';
    RAISE NOTICE '3. Testar a aplicação';
END $$;
