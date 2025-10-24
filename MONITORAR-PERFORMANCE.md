# 📊 Monitorar Performance - Instagram

## 🎯 Queries Úteis para Monitoramento

### 1. Ver Status Atual da Fila

```sql
-- Quantos vídeos em cada status
SELECT 
  platform,
  status,
  COUNT(*) as total
FROM video_queue
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY platform, status
ORDER BY platform, status;
```

**Resultado esperado**:
- `instagram | processing | 2` ← 2 simultâneos ✅
- `youtube | processing | 2` ← 2 simultâneos ✅

---

### 2. Ver Vídeos Processando AGORA

```sql
SELECT 
  vq.platform,
  vq.status,
  vq.started_at,
  EXTRACT(EPOCH FROM (NOW() - vq.started_at)) as segundos_processando,
  v.url,
  v.title
FROM video_queue vq
JOIN videos v ON v.id = vq.video_id
WHERE vq.status = 'processing'
ORDER BY vq.started_at DESC;
```

**O que observar**:
- `segundos_processando` < 120 (2 min) ← Bom ✅
- `segundos_processando` > 180 (3 min) ← Pode estar travado ⚠️

---

### 3. Tempo Médio de Processamento

```sql
SELECT 
  platform,
  COUNT(*) as total_processados,
  ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - started_at)))) as tempo_medio_segundos,
  ROUND(MIN(EXTRACT(EPOCH FROM (completed_at - started_at)))) as tempo_minimo,
  ROUND(MAX(EXTRACT(EPOCH FROM (completed_at - started_at)))) as tempo_maximo
FROM video_queue
WHERE status = 'completed'
AND completed_at > NOW() - INTERVAL '24 hours'
GROUP BY platform
ORDER BY platform;
```

**Resultado esperado**:
- Instagram pequeno: 60-90s ✅
- Instagram grande: 30-60s ✅
- YouTube: 20-40s ✅

---

### 4. Taxa de Sucesso

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

**O que observar**:
- `completed` > 95% ← Excelente ✅
- `failed` < 5% ← Aceitável ✅
- `failed` > 10% ← Investigar ⚠️

---

### 5. Vídeos que Pularam Whisper

```sql
-- Ver nos logs da função process-video
SELECT 
  timestamp,
  event_message
FROM edge_logs
WHERE function_name = 'process-video'
AND event_message LIKE '%Video too large for Whisper%'
AND timestamp > NOW() - INTERVAL '1 hour'
ORDER BY timestamp DESC;
```

**Resultado esperado**: Vídeos > 10MB aparecem aqui

---

### 6. Histórico de Processamento (Últimas 24h)

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

**Visualizar**: Quantos vídeos foram processados por hora

---

### 7. Detectar Vídeos Travados

```sql
-- Vídeos processando há mais de 5 minutos
SELECT 
  vq.id,
  vq.platform,
  vq.started_at,
  EXTRACT(EPOCH FROM (NOW() - vq.started_at)) / 60 as minutos_processando,
  vq.attempts,
  v.url
FROM video_queue vq
JOIN videos v ON v.id = vq.video_id
WHERE vq.status = 'processing'
AND vq.started_at < NOW() - INTERVAL '5 minutes'
ORDER BY vq.started_at;
```

**Ação**: Se encontrar vídeos travados, resetar para pending:
```sql
UPDATE video_queue
SET status = 'pending', started_at = NULL
WHERE id = 'ID_DO_VIDEO_TRAVADO';
```

---

### 8. Disparar Fila Manualmente

```sql
-- Se a fila não estiver processando
SELECT supabase.functions.invoke('process-video-queue', '{}');
```

---

## 📈 Dashboard de Monitoramento

### Criar View para Dashboard

```sql
CREATE OR REPLACE VIEW queue_dashboard AS
SELECT 
  -- Status atual
  (SELECT COUNT(*) FROM video_queue WHERE status = 'pending') as pendentes,
  (SELECT COUNT(*) FROM video_queue WHERE status = 'processing') as processando,
  (SELECT COUNT(*) FROM video_queue WHERE status = 'processing' AND platform = 'instagram') as instagram_processando,
  (SELECT COUNT(*) FROM video_queue WHERE status = 'processing' AND platform = 'youtube') as youtube_processando,
  
  -- Últimas 24h
  (SELECT COUNT(*) FROM video_queue WHERE status = 'completed' AND completed_at > NOW() - INTERVAL '24 hours') as completados_24h,
  (SELECT COUNT(*) FROM video_queue WHERE status = 'failed' AND completed_at > NOW() - INTERVAL '24 hours') as falhas_24h,
  
  -- Tempo médio (últimas 24h)
  (SELECT ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - started_at)))) 
   FROM video_queue 
   WHERE status = 'completed' 
   AND platform = 'instagram'
   AND completed_at > NOW() - INTERVAL '24 hours') as tempo_medio_instagram,
  
  (SELECT ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - started_at)))) 
   FROM video_queue 
   WHERE status = 'completed' 
   AND platform = 'youtube'
   AND completed_at > NOW() - INTERVAL '24 hours') as tempo_medio_youtube;
```

**Usar**:
```sql
SELECT * FROM queue_dashboard;
```

**Resultado esperado**:
```
pendentes: 0-5
processando: 2-4 (2 Instagram + 2 YouTube)
instagram_processando: 0-2
youtube_processando: 0-2
completados_24h: 50-200
falhas_24h: 0-5
tempo_medio_instagram: 45-75 segundos
tempo_medio_youtube: 25-35 segundos
```

---

## 🚨 Alertas

### Alerta 1: Fila Parada
```sql
-- Se não há vídeos processando mas há pendentes
SELECT 
  CASE 
    WHEN (SELECT COUNT(*) FROM video_queue WHERE status = 'processing') = 0
    AND (SELECT COUNT(*) FROM video_queue WHERE status = 'pending') > 0
    THEN '🚨 ALERTA: Fila parada! Disparar manualmente.'
    ELSE '✅ Fila funcionando normalmente'
  END as status_fila;
```

**Ação**: Disparar fila manualmente

---

### Alerta 2: Taxa de Falha Alta
```sql
-- Se mais de 10% dos vídeos falharam nas últimas 24h
SELECT 
  ROUND(
    (SELECT COUNT(*) FROM video_queue WHERE status = 'failed' AND completed_at > NOW() - INTERVAL '24 hours') * 100.0 /
    NULLIF((SELECT COUNT(*) FROM video_queue WHERE completed_at > NOW() - INTERVAL '24 hours'), 0),
    2
  ) as taxa_falha_percentual;
```

**Ação**: Investigar logs de erro

---

### Alerta 3: Processamento Lento
```sql
-- Se tempo médio > 120 segundos
SELECT 
  platform,
  ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - started_at)))) as tempo_medio
FROM video_queue
WHERE status = 'completed'
AND completed_at > NOW() - INTERVAL '1 hour'
GROUP BY platform
HAVING AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) > 120;
```

**Ação**: Verificar se Whisper está demorando muito

---

## 📱 Monitoramento via Dashboard

### Supabase Dashboard
1. **Edge Functions > Logs**: Ver logs em tempo real
2. **Database > SQL Editor**: Executar queries de monitoramento
3. **Database > Tables > video_queue**: Ver dados da fila

### Logs Importantes
- `🔄 Starting queue processor` ← Fila disparada
- `📊 Currently processing` ← Quantos processando
- `🎯 Looking for X video to process` ← Buscando próximo
- `✅ Video processed successfully` ← Sucesso
- `⚠️ Video too large for Whisper` ← Pulou Whisper

---

## 🎯 Métricas de Sucesso

### Excelente ✅
- Instagram: 30-90s
- YouTube: 20-40s
- Taxa de sucesso: > 95%
- 2 Instagram + 2 YouTube simultâneos

### Bom 👍
- Instagram: 90-120s
- YouTube: 40-60s
- Taxa de sucesso: > 90%
- 1-2 vídeos simultâneos

### Precisa Melhorar ⚠️
- Instagram: > 120s
- YouTube: > 60s
- Taxa de sucesso: < 90%
- Fila parada ou travada

---

**Use essas queries para monitorar a performance em tempo real!** 📊
