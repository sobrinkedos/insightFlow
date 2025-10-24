# 🔍 Análise de Problemas na Fila - 24/01/2025

## 📊 Problemas Identificados

### 1. ⏱️ Timeouts (504) nas Edge Functions

**Logs mostram:**
- `POST | 504` em `process-video` (150s timeout)
- `POST | 504` em `process-video-queue` (150s timeout)

**Causa:**
As Edge Functions do Supabase têm limite de **150 segundos** de execução. Vídeos do Instagram com transcrição via Whisper podem ultrapassar esse limite.

**Impacto:**
- Vídeo fica travado em "processing"
- Fila para de processar
- Usuário não recebe feedback

### 2. 🔄 Vídeo Travado na Fila

**Vídeo:** `38fa43c4-c3b5-48c8-b131-3024a6b1331e`
- URL: https://www.instagram.com/reel/DQH_9hhjo64/
- Status: "Na fila" (pending)
- Problema: Não foi processado

**Ação tomada:**
```sql
UPDATE video_queue 
SET status = 'pending', started_at = NULL, attempts = 0
WHERE video_id = '38fa43c4-c3b5-48c8-b131-3024a6b1331e';
```

### 3. ⚠️ Inconsistência de Status

**Vídeo:** `092a79e0-79a5-49b8-b394-efcb297d7ec8`
- Status do vídeo: "Concluído" ✅
- Status da fila: "pending" com erro ❌
- Erro: "Edge Function returned a non-2xx status code"

**Problema:** Vídeo foi processado com sucesso mas a fila não foi atualizada

**Ação tomada:**
```sql
UPDATE video_queue 
SET status = 'completed', completed_at = NOW()
WHERE video_id = '092a79e0-79a5-49b8-b394-efcb297d7ec8';
```

## 🛠️ Soluções Implementadas

### Correção Imediata
- ✅ Resetado vídeo travado para "pending"
- ✅ Corrigido status inconsistente
- ✅ Fila pronta para processar novamente

### Próximas Ações Necessárias

#### 1. Otimizar Tempo de Processamento

**Problema:** Whisper transcription pode demorar muito

**Soluções:**
- [ ] Limitar tamanho do vídeo para Whisper (já tem limite de 25MB)
- [ ] Adicionar timeout interno antes do limite da Edge Function
- [ ] Processar transcrição de forma assíncrona (separar em outra função)
- [ ] Usar streaming para vídeos grandes

#### 2. Melhorar Tratamento de Timeout

**Adicionar na `process-video-queue`:**
```typescript
// Timeout interno de 120s (antes do limite de 150s)
const PROCESSING_TIMEOUT = 120000; // 120 segundos

const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error('Processing timeout')), PROCESSING_TIMEOUT);
});

try {
  await Promise.race([
    supabaseAdmin.functions.invoke('process-video', {
      body: { video_id: nextInQueue.video_id },
    }),
    timeoutPromise
  ]);
} catch (error) {
  if (error.message === 'Processing timeout') {
    // Marcar para retry ou falha
  }
}
```

#### 3. Adicionar Monitoramento de Vídeos Travados

**Criar função de limpeza automática:**
```sql
CREATE OR REPLACE FUNCTION reset_stuck_videos()
RETURNS void AS $$
BEGIN
  -- Resetar vídeos em processing há mais de 5 minutos
  UPDATE video_queue
  SET status = 'pending', started_at = NULL
  WHERE status = 'processing'
  AND started_at < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Executar via cron job ou trigger periódico**

#### 4. Melhorar Feedback ao Usuário

**Adicionar no componente:**
- Mostrar tempo estimado de processamento
- Alertar se vídeo está demorando muito
- Opção de cancelar processamento

## 📈 Estatísticas Atuais

### Últimas 24h (Instagram)
- Total de vídeos: 35
- Concluídos: 32 (91.4%)
- Falhas: 2 (5.7%)
- Na fila: 1 (2.9%)

### Taxa de Sucesso
- **91.4%** de sucesso
- Problemas principais: timeouts e vídeos muito grandes

## 🎯 Recomendações

### Curto Prazo (Urgente)
1. ✅ Implementar timeout interno (120s)
2. ✅ Adicionar função de reset automático
3. ✅ Melhorar logs para identificar timeouts

### Médio Prazo
1. Separar transcrição em função assíncrona
2. Implementar processamento em chunks
3. Adicionar dashboard de monitoramento

### Longo Prazo
1. Migrar para processamento serverless com mais tempo
2. Implementar cache de transcrições
3. Usar serviço dedicado para vídeos grandes

## 🔧 Como Monitorar

### Query para vídeos travados
```sql
SELECT 
  v.id,
  v.url,
  v.status,
  vq.status as queue_status,
  vq.started_at,
  EXTRACT(EPOCH FROM (NOW() - vq.started_at)) as seconds_processing
FROM videos v
JOIN video_queue vq ON vq.video_id = v.id
WHERE vq.status = 'processing'
AND vq.started_at < NOW() - INTERVAL '5 minutes'
ORDER BY vq.started_at ASC;
```

### Query para taxa de sucesso
```sql
SELECT 
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
  COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing,
  COUNT(*) as total,
  ROUND(COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*), 2) as success_rate
FROM video_queue
WHERE created_at > NOW() - INTERVAL '24 hours';
```

## ✅ Status Atual

- [x] Problemas identificados
- [x] Correções imediatas aplicadas
- [x] Fila operacional
- [ ] Otimizações pendentes
- [ ] Monitoramento automático pendente

**Próximo passo:** Implementar timeout interno e função de reset automático
