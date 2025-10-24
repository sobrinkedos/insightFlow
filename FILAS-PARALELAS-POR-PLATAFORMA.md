# 🚀 Filas Paralelas por Plataforma

## 📋 Problema Identificado

Vídeos do YouTube e Instagram estavam na mesma fila, causando:
- ⏱️ **YouTube esperando Instagram**: Vídeos do YouTube (rápidos) esperavam vídeos do Instagram (lentos com Whisper)
- 🐌 **Processamento lento**: Instagram usa RapidAPI + Whisper (pode levar 2-3 minutos)
- ⚡ **YouTube rápido**: YouTube usa apenas API do YouTube + GPT (15-30 segundos)

## ✨ Solução Implementada

### 1. Filas Separadas por Plataforma

Cada plataforma tem sua própria fila virtual:
- 🎥 **YouTube**: Fila rápida
- 📸 **Instagram**: Fila lenta (com Whisper)
- 🎬 **Outras**: Fila genérica

### 2. Processamento Paralelo

Agora processamos **simultaneamente**:
- ✅ **2 vídeos do YouTube** ao mesmo tempo
- ✅ **1 vídeo do Instagram** ao mesmo tempo
- ✅ **1 vídeo de outras plataformas** ao mesmo tempo

**Total**: Até 4 vídeos processando em paralelo!

### 3. Priorização Inteligente

O sistema prioriza automaticamente:
1. **YouTube** (mais rápido)
2. **Instagram** (mais lento)
3. **Outros**

## 🔧 Alterações Técnicas

### Migration: `add_platform_to_queue`

```sql
-- Nova coluna
ALTER TABLE video_queue 
ADD COLUMN platform TEXT CHECK (platform IN ('youtube', 'instagram', 'other', 'unknown'));

-- Função para detectar plataforma
CREATE FUNCTION detect_platform(video_url TEXT) RETURNS TEXT;

-- Função para pegar próximo da fila por plataforma
CREATE FUNCTION get_next_from_queue(p_platform TEXT) RETURNS TABLE (...);

-- Atualizar get_queue_position para considerar plataforma
```

### Edge Function: `process-video-queue`

**Antes:**
- Processava 1 vídeo por vez
- Não diferenciava plataformas

**Depois:**
- Processa até 4 vídeos em paralelo
- Controla slots por plataforma
- Prioriza YouTube

### Frontend

**share-video-dialog.tsx:**
- Detecta plataforma ao compartilhar
- Salva na fila com platform

**use-video-queue.ts:**
- Adiciona campo `platform` ao tipo

**video-queue-indicator.tsx:**
- Mostra ícone da plataforma
- Indica posição na fila da plataforma específica

## 📊 Comparação de Performance

### Antes (Fila Única)

```
Cenário: 2 YouTube + 2 Instagram na fila

YouTube 1: Aguarda 0s → Processa 30s → Total: 30s
Instagram 1: Aguarda 30s → Processa 120s → Total: 150s
YouTube 2: Aguarda 150s → Processa 30s → Total: 180s
Instagram 2: Aguarda 180s → Processa 120s → Total: 300s

Tempo total: 5 minutos
```

### Depois (Filas Paralelas)

```
Cenário: 2 YouTube + 2 Instagram na fila

YouTube 1: Aguarda 0s → Processa 30s → Total: 30s
YouTube 2: Aguarda 0s → Processa 30s → Total: 30s (paralelo)
Instagram 1: Aguarda 0s → Processa 120s → Total: 120s (paralelo)
Instagram 2: Aguarda 120s → Processa 120s → Total: 240s

Tempo total: 4 minutos
Melhoria: 20% mais rápido
```

### Melhor Cenário

```
Cenário: 5 YouTube na fila

Antes:
YouTube 1-5: 30s + 30s + 30s + 30s + 30s = 150s (2.5 min)

Depois:
YouTube 1-2: 30s (paralelo)
YouTube 3-4: 30s (paralelo)
YouTube 5: 30s
Total: 90s (1.5 min)

Melhoria: 40% mais rápido!
```

## 🎯 Configuração de Slots

Você pode ajustar os limites em `process-video-queue/index.ts`:

```typescript
const MAX_YOUTUBE = 2;      // Até 2 YouTube simultâneos
const MAX_INSTAGRAM = 1;    // Até 1 Instagram simultâneo
const MAX_OTHER = 1;        // Até 1 outro simultâneo
```

**Recomendações:**
- **YouTube**: 2-3 (rápido, baixo uso de recursos)
- **Instagram**: 1-2 (lento, alto uso de recursos - Whisper)
- **Outros**: 1 (desconhecido)

## 🔍 Monitoramento

### Ver status das filas

```sql
SELECT 
  platform,
  status,
  COUNT(*) as total,
  AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) as avg_time_seconds
FROM video_queue
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY platform, status
ORDER BY platform, status;
```

### Ver processamento atual

```sql
SELECT 
  platform,
  COUNT(*) as processing_now
FROM video_queue
WHERE status = 'processing'
GROUP BY platform;
```

### Ver fila de espera por plataforma

```sql
SELECT 
  platform,
  COUNT(*) as waiting,
  MIN(created_at) as oldest_waiting
FROM video_queue
WHERE status = 'pending'
GROUP BY platform
ORDER BY waiting DESC;
```

## 🧪 Como Testar

### Teste 1: YouTube Rápido

1. Compartilhe 3 vídeos do YouTube rapidamente
2. Observe que 2 processam simultaneamente
3. O 3º processa logo após um dos 2 terminar
4. Tempo total: ~45 segundos (vs 90s antes)

### Teste 2: Mix YouTube + Instagram

1. Compartilhe 2 YouTube + 1 Instagram
2. Observe que todos 3 processam simultaneamente
3. YouTube terminam em ~30s
4. Instagram termina em ~2min
5. Tempo total: ~2min (vs 4min antes)

### Teste 3: Verificar Indicador

1. Compartilhe vídeos de diferentes plataformas
2. Veja o indicador de fila
3. Deve mostrar ícones: ▶️ YouTube, 📸 Instagram
4. Posição na fila é por plataforma

## ⚠️ Limitações

### Edge Functions Timeout

- Limite: 150 segundos por função
- Instagram com Whisper pode ultrapassar
- **Solução futura**: Processar Whisper separadamente

### Recursos do Supabase

- Cada função usa recursos
- Muitas funções paralelas = mais custo
- **Recomendação**: Monitorar uso

### RapidAPI Rate Limits

- Instagram usa RapidAPI
- Pode ter limite de requisições
- **Solução**: Implementar rate limiting

## 🚀 Próximas Melhorias

### Curto Prazo
- [ ] Adicionar timeout interno (120s)
- [ ] Melhorar logs por plataforma
- [ ] Dashboard de monitoramento

### Médio Prazo
- [ ] Processar Whisper em função separada
- [ ] Implementar cache de transcrições
- [ ] Rate limiting para RapidAPI

### Longo Prazo
- [ ] Auto-scaling de slots baseado em carga
- [ ] Priorização dinâmica
- [ ] Processamento distribuído

## ✅ Checklist de Deploy

- [x] Migration aplicada
- [x] Coluna `platform` adicionada
- [x] Funções SQL criadas
- [x] Edge Function atualizada
- [x] Frontend atualizado
- [ ] Deploy da Edge Function
- [ ] Teste com vídeos reais
- [ ] Monitoramento ativo

## 📈 Métricas de Sucesso

**Antes:**
- Tempo médio YouTube: 30s + tempo de espera
- Tempo médio Instagram: 120s + tempo de espera
- Throughput: 1 vídeo por vez

**Depois:**
- Tempo médio YouTube: 30s (sem espera se slot disponível)
- Tempo médio Instagram: 120s (sem espera se slot disponível)
- Throughput: Até 4 vídeos simultâneos

**Melhoria esperada:**
- ⚡ 40-60% mais rápido para YouTube
- ⚡ 20-30% mais rápido no geral
- 🎯 Melhor experiência do usuário
