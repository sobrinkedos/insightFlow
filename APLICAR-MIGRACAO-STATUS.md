# 🚀 Aplicar Migração de Status - AGORA

## Passo a Passo Rápido

### 1. Abra o Supabase Dashboard
https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new

### 2. Cole este SQL e Execute:

```sql
-- Padronizar valores de status para português
UPDATE videos SET status = 'Processando' WHERE status IN ('pending', 'processing');
UPDATE videos SET status = 'Concluído' WHERE status IN ('completed', 'Concluído');
UPDATE videos SET status = 'Falha' WHERE status IN ('failed');

-- Alterar o default para português
ALTER TABLE videos ALTER COLUMN status SET DEFAULT 'Processando';

-- Adicionar comentário explicativo
COMMENT ON COLUMN videos.status IS 'Status do processamento: Processando, Concluído, Falha';
```

### 3. Clique em "RUN" ou pressione Ctrl+Enter

### 4. Verifique se funcionou:

```sql
SELECT id, url, status, created_at 
FROM videos 
ORDER BY created_at DESC 
LIMIT 5;
```

Você deve ver os status em português: `Processando`, `Concluído`, `Falha`

## ✅ Pronto!

Agora teste adicionando um novo vídeo do Instagram e veja os logs no console do navegador.
