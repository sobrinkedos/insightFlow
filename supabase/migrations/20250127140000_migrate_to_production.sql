-- Migração Completa para Produção
-- Data: 2025-01-27
-- Descrição: Migra toda a estrutura do banco de desenvolvimento para produção
-- IMPORTANTE: Esta migração cria APENAS a estrutura (tabelas, políticas, funções)
--             NÃO inclui dados/registros

-- ============================================================================
-- EXTENSÕES
-- ============================================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================================================
-- TABELAS DE CONTROLE (devem ser criadas primeiro)
-- ============================================================================

-- Tabela: migration_history
CREATE TABLE IF NOT EXISTS public.migration_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    applied_by VARCHAR(255),
    execution_time_ms INTEGER,
    status VARCHAR(50) CHECK (status IN ('success', 'failed', 'rolled_back')) NOT NULL,
    environment VARCHAR(50) CHECK (environment IN ('development', 'test', 'production')) NOT NULL,
    checksum VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_migration_version ON public.migration_history(version);
CREATE INDEX IF NOT EXISTS idx_migration_environment ON public.migration_history(environment);
CREATE INDEX IF NOT EXISTS idx_migration_status ON public.migration_history(status);
CREATE INDEX IF NOT EXISTS idx_migration_applied_at ON public.migration_history(applied_at DESC);

COMMENT ON TABLE public.migration_history IS 'Histórico de migrações aplicadas no banco de dados';

-- Tabela: backup_history
CREATE TABLE IF NOT EXISTS public.backup_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    type VARCHAR(50) CHECK (type IN ('daily', 'weekly', 'monthly', 'manual', 'pre_migration')) NOT NULL,
    size_mb DECIMAL(10, 2),
    status VARCHAR(50) CHECK (status IN ('in_progress', 'completed', 'failed', 'verified')) NOT NULL,
    source_environment VARCHAR(50) DEFAULT 'production',
    verification_status VARCHAR(50),
    retention_until TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_backup_timestamp ON public.backup_history(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_backup_type ON public.backup_history(type);
CREATE INDEX IF NOT EXISTS idx_backup_status ON public.backup_history(status);

COMMENT ON TABLE public.backup_history IS 'Histórico de backups realizados';

-- Tabela: resource_usage
CREATE TABLE IF NOT EXISTS public.resource_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name VARCHAR(255) NOT NULL,
    environment VARCHAR(50),
    measured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    storage_mb DECIMAL(10, 2),
    bandwidth_mb DECIMAL(10, 2),
    database_size_mb DECIMAL(10, 2),
    active_connections INTEGER,
    api_requests INTEGER,
    storage_limit_mb DECIMAL(10, 2) DEFAULT 500,
    bandwidth_limit_mb DECIMAL(10, 2) DEFAULT 2048,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resource_project ON public.resource_usage(project_name);
CREATE INDEX IF NOT EXISTS idx_resource_measured_at ON public.resource_usage(measured_at DESC);

COMMENT ON TABLE public.resource_usage IS 'Monitoramento de uso de recursos do Supabase';

-- ============================================================================
-- TABELA: profiles
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- ============================================================================
-- TABELA: videos
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
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
    status TEXT DEFAULT 'Processando'::text NOT NULL,
    is_favorite BOOLEAN DEFAULT false,
    is_tutorial BOOLEAN DEFAULT false,
    tutorial_steps TEXT,
    manual_description TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    processed_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON COLUMN public.videos.status IS 'Status do processamento: Processando, Concluído, Falha';
COMMENT ON COLUMN public.videos.is_favorite IS 'Indicates if the video is marked as favorite by the user';
COMMENT ON COLUMN public.videos.is_tutorial IS 'Indicates if the video is identified as a tutorial';
COMMENT ON COLUMN public.videos.tutorial_steps IS 'Step-by-step instructions if video is a tutorial';
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
CREATE POLICY "Users can view own videos"
    ON public.videos FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own videos"
    ON public.videos FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own videos"
    ON public.videos FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own videos"
    ON public.videos FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- TABELA: themes
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    consolidated_summary TEXT,
    keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON COLUMN public.themes.title IS 'Título do tema sempre em português, sem prefixo "Tema sobre"';

-- Índices
CREATE INDEX IF NOT EXISTS idx_themes_user_id ON public.themes(user_id);
CREATE INDEX IF NOT EXISTS idx_themes_created_at ON public.themes(created_at DESC);

-- RLS
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Users can view own themes"
    ON public.themes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own themes"
    ON public.themes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own themes"
    ON public.themes FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own themes"
    ON public.themes FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- TABELA: theme_videos (relação muitos-para-muitos)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.theme_videos (
    theme_id UUID REFERENCES public.themes(id) ON DELETE CASCADE NOT NULL,
    video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (theme_id, video_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_theme_videos_theme_id ON public.theme_videos(theme_id);
CREATE INDEX IF NOT EXISTS idx_theme_videos_video_id ON public.theme_videos(video_id);

-- RLS
ALTER TABLE public.theme_videos ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Users can view own theme_videos"
    ON public.theme_videos FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.themes
            WHERE themes.id = theme_videos.theme_id
            AND themes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own theme_videos"
    ON public.theme_videos FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.themes
            WHERE themes.id = theme_videos.theme_id
            AND themes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own theme_videos"
    ON public.theme_videos FOR DELETE
    USING (
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
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE NOT NULL,
    watched_time NUMERIC DEFAULT 0 NOT NULL,
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
CREATE POLICY "Users can view own progress"
    ON public.video_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
    ON public.video_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
    ON public.video_progress FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
    ON public.video_progress FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- TABELA: video_queue
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.video_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending'::text NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    platform TEXT DEFAULT 'unknown'::text CHECK (platform IN ('youtube', 'instagram', 'other', 'unknown')),
    priority INTEGER DEFAULT 0 NOT NULL,
    attempts INTEGER DEFAULT 0 NOT NULL,
    max_attempts INTEGER DEFAULT 3 NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON COLUMN public.video_queue.platform IS 'Platform of the video (youtube, instagram, other) for separate queue processing';

-- Índices
CREATE INDEX IF NOT EXISTS idx_video_queue_status ON public.video_queue(status);
CREATE INDEX IF NOT EXISTS idx_video_queue_platform ON public.video_queue(platform);
CREATE INDEX IF NOT EXISTS idx_video_queue_priority ON public.video_queue(priority DESC);
CREATE INDEX IF NOT EXISTS idx_video_queue_created_at ON public.video_queue(created_at);

-- RLS
ALTER TABLE public.video_queue ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Users can view own queue items"
    ON public.video_queue FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own queue items"
    ON public.video_queue FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own queue items"
    ON public.video_queue FOR UPDATE
    USING (auth.uid() = user_id);

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

-- Triggers para updated_at
CREATE TRIGGER handle_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_themes
    BEFORE UPDATE ON public.themes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_video_progress
    BEFORE UPDATE ON public.video_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Função para criar perfil automaticamente ao criar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Função para resetar vídeos travados
CREATE OR REPLACE FUNCTION public.reset_stuck_videos()
RETURNS void AS $$
BEGIN
    UPDATE public.video_queue
    SET 
        status = 'pending',
        started_at = NULL,
        attempts = attempts + 1
    WHERE 
        status = 'processing'
        AND started_at < NOW() - INTERVAL '30 minutes'
        AND attempts < max_attempts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GRANTS (Permissões)
-- ============================================================================

-- Garantir que usuários autenticados possam acessar as tabelas
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- ============================================================================
-- REGISTRO DA MIGRAÇÃO
-- ============================================================================

-- Registra esta migração como aplicada
INSERT INTO public.migration_history (
    version,
    name,
    status,
    environment,
    applied_by,
    execution_time_ms
) VALUES (
    '20250127140000',
    'migrate_to_production',
    'success',
    'production',
    current_user,
    0
) ON CONFLICT (version) DO NOTHING;

-- ============================================================================
-- MENSAGEM DE CONCLUSÃO
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Migração completa para produção concluída!';
    RAISE NOTICE 'Tabelas criadas: profiles, videos, themes, theme_videos, video_progress, video_queue';
    RAISE NOTICE 'RLS habilitado em todas as tabelas';
    RAISE NOTICE 'Políticas de segurança aplicadas';
    RAISE NOTICE 'Funções e triggers configurados';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️ PRÓXIMOS PASSOS:';
    RAISE NOTICE '1. Migrar Edge Functions manualmente';
    RAISE NOTICE '2. Configurar secrets no Supabase (OPENAI_API_KEY, etc)';
    RAISE NOTICE '3. Testar a aplicação em produção';
END $$;
