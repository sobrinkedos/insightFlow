# ⚡ IMPLEMENTAR AGORA - Solução Fila Parada

## 🎯 O Que Vamos Fazer

Implementar **Cron Job** para que a fila de vídeos seja verificada
**automaticamente a cada 30 segundos**, garantindo que nenhum Instagram fique
parado.

---

## 🚀 Passo a Passo (5 minutos)

### 1️⃣ Deploy da Função queue-cron (2 min)

Execute:

```bash
deploy-cron-job.bat
```

**OU** faça manualmente via Dashboard:

1. https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/functions
2. New function → Nome: `queue-cron`
3. Cole código de: `supabase/functions/queue-cron/index.ts`
4. Deploy

---

### 2️⃣ Configurar Cron Job (3 min)

1. **Acesse**:
   https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/database/cron-jobs

2. **Clique**: "Create a new cron job"

3. **Preencha**:

```
Name: queue-processor
Schedule: */30 * * * *
```

4. **Command** (copie e cole):

```sql
SELECT
  net.http_post(
    url := 'https://enkpfnqsjjnanlqhjnsv.supabase.co/functions/v1/queue-cron',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb,
    body := '{}'::jsonb
  ) as request_id;
```

5. **Salvar**: "Create cron job"

---

### 3️⃣ Testar (1 min)

Compartilhe um Instagram e aguarde 30 segundos. Deve processar automaticamente!

Verifique:

```sql
SELECT platform, status, created_at
FROM video_queue
WHERE created_at > NOW() - INTERVAL '5 minutes'
ORDER BY created_at DESC;
```

---

## ✅ Pronto!

Agora a fila verifica automaticamente a cada 30 segundos. Nenhum vídeo ficará
parado!

---

## 📚 Documentação

- **Guia Completo**: `CONFIGURAR-CRON-JOB.md`
- **Solução Detalhada**: `SOLUCAO-FILA-PARADA.md`
- **Script de Deploy**: `deploy-cron-job.bat`

---

**Tempo total**: 5 minutos\
**Resultado**: Fila 100% automática! ⏰
