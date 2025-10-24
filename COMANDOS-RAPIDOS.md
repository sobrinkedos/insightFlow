# ⚡ Comandos Rápidos - Copy & Paste

## 🚀 Deploy

### Via CLI
```bash
supabase functions deploy process-video-queue
supabase functions deploy process-video
```

### Via Script
```bash
deploy-otimizacoes.bat
```

---

## 📊 Monitoramento

### Ver status atual da fila
```sql
SELECT platform, status, COUNT(*) 
FROM video_queue 
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY platform, status
ORDER BY platform, status;
```

### Ver vídeos processando AGORA
```sql
SELECT 
  vq.platform,
  EXTRACT(EPOCH FROM (NOW() - vq.started_at)) as segundos_processando,
  v.url
FROM video_queue vq
JOIN videos v ON v.id = vq.video_id
WHERE vq.status = 'processing';
```

### Tempo médio de processamento (última hora)
```sql
SELECT 
  platform,
  COUNT(*) as total,
  ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - started_at)))) as tempo_medio_seg
FROM video_queue
WHERE status = 'completed'
AND completed_at > NOW() - INTERVAL '1 hour'
GROUP BY platform;
```

### Taxa de sucesso (últimas 24h)
```sql
SELECT 
  platform,
  status,
  COUNT(*) as total,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY platform), 2) as percentual
FROM video_queue
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY platform, status
ORDER BY platform, status;
```

---

## 🔧 Troubleshooting

### Disparar fila manualmente
```sql
SELECT supabase.functions.invoke('process-video-queue', '{}');
```

### Resetar vídeos travados (processando > 5 min)
```sql
UPDATE video_queue
SET status = 'pending', started_at = NULL
WHERE status = 'processing'
AND started_at < NOW() - INTERVAL '5 minutes';
```

### Ver vídeos que falharam (última hora)
```sql
SELECT 
  vq.platform,
  vq.error_message,
  vq.attempts,
  v.url
FROM video_queue vq
JOIN videos v ON v.id = vq.video_id
WHERE vq.status = 'failed'
AND vq.completed_at > NOW() - INTERVAL '1 hour'
ORDER BY vq.completed_at DESC;
```

### Reprocessar vídeo que falhou
```sql
-- Substitua VIDEO_ID pelo ID do vídeo
UPDATE video_queue
SET status = 'pending', attempts = 0, error_message = NULL
WHERE video_id = 'VIDEO_ID';

-- Disparar fila
SELECT supabase.functions.invoke('process-video-queue', '{}');
```

---

## 📈 Dashboard

### Criar view de dashboard
```sql
CREATE OR REPLACE VIEW queue_dashboard AS
SELECT 
  (SELECT COUNT(*) FROM video_queue WHERE status = 'pending') as pendentes,
  (SELECT COUNT(*) FROM video_queue WHERE status = 'processing') as processando,
  (SELECT COUNT(*) FROM video_queue WHERE status = 'processing' AND platform = 'instagram') as instagram_processando,
  (SELECT COUNT(*) FROM video_queue WHERE status = 'processing' AND platform = 'youtube') as youtube_processando,
  (SELECT COUNT(*) FROM video_queue WHERE status = 'completed' AND completed_at > NOW() - INTERVAL '24 hours') as completados_24h,
  (SELECT COUNT(*) FROM video_queue WHERE status = 'failed' AND completed_at > NOW() - INTERVAL '24 hours') as falhas_24h,
  (SELECT ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - started_at)))) 
   FROM video_queue 
   WHERE status = 'completed' 
   AND platform = 'instagram'
   AND completed_at > NOW() - INTERVAL '24 hours') as tempo_medio_instagram_seg,
  (SELECT ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - started_at)))) 
   FROM video_queue 
   WHERE status = 'completed' 
   AND platform = 'youtube'
   AND completed_at > NOW() - INTERVAL '24 hours') as tempo_medio_youtube_seg;
```

### Ver dashboard
```sql
SELECT * FROM queue_dashboard;
```

---

## 🎯 Testes

### Teste 1: Verificar processamento paralelo
```sql
-- Deve mostrar 2 Instagrams processando
SELECT platform, COUNT(*) 
FROM video_queue 
WHERE status = 'processing' 
AND platform = 'instagram'
GROUP BY platform;
```

### Teste 2: Ver vídeos que pularam Whisper
```sql
-- Executar no Dashboard > Edge Functions > process-video > Logs
-- Procurar por: "Video too large for Whisper API (>10MB)"
```

### Teste 3: Histórico de processamento (últimas 24h)
```sql
SELECT 
  DATE_TRUNC('hour', completed_at) as hora,
  platform,
  COUNT(*) as videos_processados,
  ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - started_at)))) as tempo_medio_seg
FROM video_queue
WHERE status = 'completed'
AND completed_at > NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', completed_at), platform
ORDER BY hora DESC, platform;
```

---

## 🚨 Alertas

### Alerta: Fila parada
```sql
SELECT 
  CASE 
    WHEN (SELECT COUNT(*) FROM video_queue WHERE status = 'processing') = 0
    AND (SELECT COUNT(*) FROM video_queue WHERE status = 'pending') > 0
    THEN '🚨 ALERTA: Fila parada! Disparar manualmente.'
    ELSE '✅ Fila funcionando normalmente'
  END as status_fila;
```

### Alerta: Taxa de falha alta (> 10%)
```sql
SELECT 
  ROUND(
    (SELECT COUNT(*) FROM video_queue WHERE status = 'failed' AND completed_at > NOW() - INTERVAL '24 hours') * 100.0 /
    NULLIF((SELECT COUNT(*) FROM video_queue WHERE completed_at > NOW() - INTERVAL '24 hours'), 0),
    2
  ) as taxa_falha_percentual;
```

### Alerta: Processamento lento (> 120s)
```sql
SELECT 
  platform,
  ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - started_at)))) as tempo_medio_seg
FROM video_queue
WHERE status = 'completed'
AND completed_at > NOW() - INTERVAL '1 hour'
GROUP BY platform
HAVING AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) > 120;
```

---

## 🔄 Cron Job (Opcional)

### Deploy cron job
```bash
supabase functions deploy queue-cron
```

### Configurar no Supabase
```
Database > Cron Jobs > New Job
Schedule: */30 * * * * *
Command: SELECT supabase.functions.invoke('queue-cron', '{}')
```

### Testar cron job
```sql
SELECT supabase.functions.invoke('queue-cron', '{}');
```

---

## 📱 Links Úteis

### Supabase Dashboard
- **Functions**: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/functions
- **SQL Editor**: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/sql
- **Logs**: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/logs

### Documentação
- `DEPLOY-OTIMIZACOES.md` - Guia completo de deploy
- `RESUMO-OTIMIZACOES.md` - Resumo visual das mudanças
- `MONITORAR-PERFORMANCE.md` - Queries detalhadas
- `CHECKLIST-COMPLETO.md` - Checklist passo a passo

---

## 🎉 Quick Start

### 1. Deploy (escolha uma opção)
```bash
# Opção A: Script automático
deploy-otimizacoes.bat

# Opção B: CLI manual
supabase functions deploy process-video-queue
supabase functions deploy process-video

# Opção C: Via Dashboard
# https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/functions
```

### 2. Testar
```sql
-- Compartilhe 2 Instagrams e execute:
SELECT platform, status, COUNT(*) 
FROM video_queue 
WHERE created_at > NOW() - INTERVAL '10 minutes'
GROUP BY platform, status;

-- Resultado esperado: instagram | processing | 2
```

### 3. Monitorar
```sql
-- Ver dashboard
SELECT * FROM queue_dashboard;

-- Resultado esperado:
-- instagram_processando: 0-2
-- tempo_medio_instagram_seg: 30-90
```

---

**Pronto! Copie e cole os comandos conforme necessário.** 📋
