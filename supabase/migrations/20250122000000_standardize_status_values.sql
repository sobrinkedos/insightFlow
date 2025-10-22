-- Padronizar valores de status para português
-- Atualizar valores existentes
UPDATE videos SET status = 'Processando' WHERE status IN ('pending', 'processing');
UPDATE videos SET status = 'Concluído' WHERE status IN ('completed', 'Concluído');
UPDATE videos SET status = 'Falha' WHERE status IN ('failed');

-- Alterar o default para português
ALTER TABLE videos ALTER COLUMN status SET DEFAULT 'Processando';

-- Adicionar comentário explicativo
COMMENT ON COLUMN videos.status IS 'Status do processamento: Processando, Concluído, Falha';
