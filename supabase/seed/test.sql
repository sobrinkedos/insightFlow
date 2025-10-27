-- Seed Data para Teste/Staging
-- Este arquivo contém dados de teste para o ambiente de staging

-- ============================================================================
-- DADOS DE TESTE
-- ============================================================================

-- Limpar dados existentes (apenas em teste)
TRUNCATE TABLE public.resource_usage CASCADE;

-- Inserir dados de exemplo de uso de recursos (teste)
INSERT INTO public.resource_usage (
    project_name,
    environment,
    storage_mb,
    bandwidth_mb,
    database_size_mb,
    active_connections,
    api_requests,
    storage_limit_mb,
    bandwidth_limit_mb
) VALUES
    ('insightTest', 'test', 75.5, 250.2, 70.8, 8, 2250, 500, 2048),
    ('insightTest', 'test', 78.3, 265.8, 72.2, 9, 2380, 500, 2048),
    ('insightTest', 'test', 80.1, 272.4, 73.9, 7, 2420, 500, 2048);

-- Inserir exemplo de backup (simulado)
INSERT INTO public.backup_history (
    type,
    size_mb,
    status,
    source_environment,
    verification_status,
    retention_until,
    metadata
) VALUES
    ('manual', 70.8, 'completed', 'test', 'verified', NOW() + INTERVAL '30 days', '{"note": "Backup de teste staging"}'),
    ('daily', 72.2, 'completed', 'test', 'verified', NOW() + INTERVAL '30 days', '{"automated": true}'),
    ('pre_migration', 73.9, 'completed', 'test', 'verified', NOW() + INTERVAL '30 days', '{"migration": "test_migration"}');

-- ============================================================================
-- MENSAGEM DE CONFIRMAÇÃO
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Seed data para teste/staging carregado com sucesso!';
    RAISE NOTICE 'Ambiente: test';
    RAISE NOTICE 'Dados inseridos: resource_usage (3), backup_history (3)';
END $$;
