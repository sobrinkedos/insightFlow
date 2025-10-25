# 🚨 Disparar Fila Manualmente - Solução Imediata

## ⚠️ Problema Atual

Há **1 Instagram pendente** que não está processando porque:
- O cron job ainda não foi implementado
- A fila só dispara quando um novo vídeo é compartilhado

## ✅ Solução Imediata (30 segundos)

### Via Dashboard do Supabase

1. **Acesse**: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/functions/process-video-queue

2. **Clique em**: "Invoke function"

3. **Payload**: Cole isso:
```json
{}
```

4. **Clique em**: "Invoke"

5. **Aguarde**: 10-30 segundos

6. **Verifique**: O vídeo deve começar a processar

---

## 🔧 Solução Definitiva (5 minutos)

Para que isso nunca mais aconteça, implemente o **Cron Job**:

### Passo 1: Deploy da Função (2 min)

Execute no terminal:
```bash
supabase functions deploy queue-cron
```

**OU** via Dashboard:
1. https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/functions
2. New function → Nome: `queue-cron`
3. Cole código de: `supabase/functions/queue-cron/index.ts`
4. Deploy

### Passo 2: Configurar Cron Job (3 min)

1. **Acesse**: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/database/cron-jobs

2. **Clique**: "Create a new cron job"

3. **Configure**:
   - **Name**: `queue-processor`
   - **Schedule**: `*/30 * * * *` (a cada 30 segundos)
   - **Command**:
```sql
SELECT
  net.http_post(
    url := 'https://enkpfnqsjjnanlqhjnsv.supabase.co/functions/v1/queue-cron',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb,
    body := '{}'::jsonb
  ) as request_id;
```

4. **Salvar**: "Create cron job"

---

## 🎯 Resultado

### Sem Cron Job (Atual)
- ❌ Vídeos ficam pendentes
- ❌ Precisa disparar manualmente
- ❌ Depende de novo compartilhamento

### Com Cron Job (Depois)
- ✅ Fila verifica a cada 30s
- ✅ Totalmente automático
- ✅ Nenhum vídeo fica parado

---

## 📊 Verificar se Funcionou

Após disparar manualmente, execute no SQL Editor:

```sql
SELECT platform, status, started_at
FROM video_queue
WHERE created_at > NOW() - INTERVAL '10 minutes'
ORDER BY created_at DESC;
```

**Resultado esperado**: `status = 'processing'` ou `'completed'`

---

**Dispare a fila agora e depois implemente o cron job!** ⚡
