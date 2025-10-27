-- Migração Inicial: Tabelas de Controle
-- Data: 2025-01-27
-- Descrição: Cria tabelas para controle de migrações, backups e monitoramento

-- ============================================================================
-- TABELA: migration_history
-- Descrição: Rastreia todas as migrações aplicadas em cada ambiente
-- ============================================================================
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

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_migration_version ON public.migration_history(version);
CREATE INDEX IF NOT EXISTS idx_migration_environment ON public.migration_history(environment);
CREATE INDEX IF NOT EXISTS idx_migration_status ON public.migration_history(status);
CREATE INDEX IF NOT EXISTS idx_migration_applied_at ON public.migration_history(applied_at DESC);

-- Comentários
COMMENT ON TABLE public.migration_history IS 'Histórico de migrações aplicadas no banco de dados';
COMMENT ON COLUMN public.migration_history.version IS 'Versão da migração (timestamp)';
COMMENT ON COLUMN public.migration_history.name IS 'Nome descritivo da migração';
COMMENT ON COLUMN public.migration_history.checksum IS 'Hash MD5 do conteúdo da migração';

-- ============================================================================
-- TABELA: backup_history
-- Descrição: Rastreia todos os backups realizados
-- ============================================================================
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

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_backup_timestamp ON public.backup_history(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_backup_type ON public.backup_history(type);
CREATE INDEX IF NOT EXISTS idx_backup_status ON public.backup_history(status);
CREATE INDEX IF NOT EXISTS idx_backup_retention ON public.backup_history(retention_until);

-- Comentários
COMMENT ON TABLE public.backup_history IS 'Histórico de backups realizados';
COMMENT ON COLUMN public.backup_history.type IS 'Tipo de backup (daily, weekly, monthly, manual, pre_migration)';
COMMENT ON COLUMN public.backup_history.retention_until IS 'Data até quando o backup deve ser mantido';

-- ============================================================================
-- TABELA: resource_usage
-- Descrição: Monitora uso de recursos do Supabase
-- ============================================================================
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

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_resource_project ON public.resource_usage(project_name);
CREATE INDEX IF NOT EXISTS idx_resource_measured_at ON public.resource_usage(measured_at DESC);
CREATE INDEX IF NOT EXISTS idx_resource_environment ON public.resource_usage(environment);

-- Comentários
COMMENT ON TABLE public.resource_usage IS 'Monitoramento de uso de recursos do Supabase';
COMMENT ON COLUMN public.resource_usage.storage_limit_mb IS 'Limite de armazenamento (500MB no tier gratuito)';
COMMENT ON COLUMN public.resource_usage.bandwidth_limit_mb IS 'Limite de largura de banda (2GB no tier gratuito)';

-- ============================================================================
-- FUNÇÕES AUXILIARES
-- ============================================================================

-- Função para calcular porcentagem de uso
CREATE OR REPLACE FUNCTION public.calculate_usage_percentage(
    current_value DECIMAL,
    limit_value DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
    IF limit_value IS NULL OR limit_value = 0 THEN
        RETURN 0;
    END IF;
    RETURN ROUND((current_value / limit_value) * 100, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION public.calculate_usage_percentage IS 'Calcula porcentagem de uso de um recurso';

-- ============================================================================
-- VIEWS
-- ============================================================================

-- View para últimas migrações por ambiente
CREATE OR REPLACE VIEW public.latest_migrations AS
SELECT DISTINCT ON (environment)
    id,
    version,
    name,
    applied_at,
    status,
    environment,
    execution_time_ms
FROM public.migration_history
ORDER BY environment, applied_at DESC;

COMMENT ON VIEW public.latest_migrations IS 'Última migração aplicada em cada ambiente';

-- View para status de backups recentes
CREATE OR REPLACE VIEW public.recent_backups AS
SELECT
    id,
    timestamp,
    type,
    size_mb,
    status,
    verification_status,
    retention_until,
    CASE
        WHEN retention_until < NOW() THEN 'expired'
        WHEN retention_until < NOW() + INTERVAL '7 days' THEN 'expiring_soon'
        ELSE 'active'
    END as retention_status
FROM public.backup_history
WHERE timestamp > NOW() - INTERVAL '30 days'
ORDER BY timestamp DESC;

COMMENT ON VIEW public.recent_backups IS 'Backups dos últimos 30 dias com status de retenção';

-- View para alertas de uso de recursos
CREATE OR REPLACE VIEW public.resource_alerts AS
SELECT
    project_name,
    environment,
    measured_at,
    storage_mb,
    storage_limit_mb,
    calculate_usage_percentage(storage_mb, storage_limit_mb) as storage_usage_pct,
    bandwidth_mb,
    bandwidth_limit_mb,
    calculate_usage_percentage(bandwidth_mb, bandwidth_limit_mb) as bandwidth_usage_pct,
    CASE
        WHEN calculate_usage_percentage(storage_mb, storage_limit_mb) >= 90 THEN 'critical'
        WHEN calculate_usage_percentage(storage_mb, storage_limit_mb) >= 80 THEN 'warning'
        WHEN calculate_usage_percentage(bandwidth_mb, bandwidth_limit_mb) >= 90 THEN 'critical'
        WHEN calculate_usage_percentage(bandwidth_mb, bandwidth_limit_mb) >= 80 THEN 'warning'
        ELSE 'ok'
    END as alert_level
FROM public.resource_usage
WHERE measured_at > NOW() - INTERVAL '24 hours'
ORDER BY measured_at DESC;

COMMENT ON VIEW public.resource_alerts IS 'Alertas de uso de recursos nas últimas 24 horas';

-- ============================================================================
-- PERMISSÕES (RLS desabilitado para tabelas de sistema)
-- ============================================================================

-- Estas tabelas são de sistema e não precisam de RLS
-- O acesso será controlado via Service Role Key

ALTER TABLE public.migration_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_usage ENABLE ROW LEVEL SECURITY;

-- Política: Apenas service role pode acessar
CREATE POLICY "Service role only" ON public.migration_history
    FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role only" ON public.backup_history
    FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role only" ON public.resource_usage
    FOR ALL
    USING (auth.role() = 'service_role');

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
    '20250127000000',
    'initial_schema',
    'success',
    COALESCE(current_setting('app.environment', true), 'development'),
    current_user,
    0
) ON CONFLICT (version) DO NOTHING;
