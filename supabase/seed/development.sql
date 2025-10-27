-- Seed Data para Desenvolvimento
-- Este arquivo contém dados de teste para o ambiente de desenvolvimento

-- ============================================================================
-- DADOS DE TESTE
-- ============================================================================

-- Limpar dados existentes (apenas em desenvolvimento)
TRUNCATE TABLE public.resource_usage CASCADE;

-- Inserir dados de exemplo de uso de recursos
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
    ('insightDev', 'development', 50.5, 150.2, 45.8, 5, 1250, 500, 2048),
    ('insightDev', 'development', 52.3, 165.8, 47.2, 6, 1380, 500, 2048),
    ('insightDev', 'development', 54.1, 172.4, 48.9, 4, 1420, 500, 2048);

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
    ('manual', 45.8, 'completed', 'development', 'verified', NOW() + INTERVAL '30 days', '{"note": "Backup de teste"}'),
    ('daily', 47.2, 'completed', 'development', 'verified', NOW() + INTERVAL '30 days', '{"automated": true}');

-- ============================================================================
-- MENSAGEM DE CONFIRMAÇÃO
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Seed data para desenvolvimento carregado com sucesso!';
    RAISE NOTICE 'Ambiente: development';
    RAISE NOTICE 'Dados inseridos: resource_usage (3), backup_history (2)';
END $$;
