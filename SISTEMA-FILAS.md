# Sistema de Filas para Processamento de Vídeos

## 📋 Visão Geral

Implementamos um sistema robusto de filas para gerenciar o processamento sequencial de vídeos, evitando conflitos com a API do RapidAPI e garantindo processamento confiável.

## 🎯 Problema Resolvido

Quando múltiplos vídeos do Instagram eram enviados simultaneamente, a API do RapidAPI não conseguia processar mais de um vídeo por vez, causando falhas no processamento.

## ✨ Solução Implementada

### 1. Tabela de Fila (`video_queue`)

Criamos uma tabela dedicada para gerenciar a fila de processamento:

```sql
- id: UUID único do item na fila
- video_id: Referência ao vídeo
- user_id: Usuário que enviou
- status: 'pending' | 'processing' | 'completed' | 'failed'
- priority: Prioridade (maior = processa primeiro)
- attempts: Número de tentativas
- max_attempts: Máximo de tentativas (padrão: 3)
- error_message: Mensagem de erro se falhar
- created_at, started_at, completed_at: Timestamps
```

### 2. Edge Function `process-video-queue`

Nova função que:
- ✅ Verifica se já existe um vídeo sendo processado
- ✅ Pega o próximo vídeo da fila (por prioridade e ordem de chegada)
- ✅ Marca como "processing"
- ✅ Invoca a função `process-video`
- ✅ Marca como "completed" ou "failed"
- ✅ Implementa retry automático (até 3 tentativas)
- ✅ Dispara o próximo processamento automaticamente

### 3. Componentes React

#### `useVideoQueue` Hook
- Monitora a fila em tempo real
- Retorna contadores (processando, pendente, total)
- Atualiza automaticamente via Realtime

#### `VideoQueueIndicator` Component
- Mostra status visual da fila
- Exibe posição de cada vídeo
- Animações suaves
- Indicadores de progresso

### 4. Fluxo de Processamento

```
1. Usuário compartilha vídeo
   ↓
2. Vídeo inserido com status "Na fila"
   ↓
3. Item adicionado à tabela video_queue
   ↓
4. Função get_queue_position calcula posição
   ↓
5. Toast mostra posição na fila
   ↓
6. process-video-queue é disparada
   ↓
7. Verifica se há processamento em andamento
   ↓
8. Se não, pega próximo da fila
   ↓
9. Marca como "processing"
   ↓
10. Processa o vídeo
    ↓
11. Marca como "completed"
    ↓
12. Dispara próximo processamento
```

## 🚀 Funcionalidades

### Processamento Sequencial
- ✅ Apenas 1 vídeo processado por vez
- ✅ Evita conflitos com APIs externas
- ✅ Garante qualidade do processamento

### Sistema de Prioridades
- ✅ Vídeos podem ter prioridade diferente
- ✅ Prioridade maior processa primeiro
- ✅ Mesma prioridade = FIFO (primeiro a entrar, primeiro a sair)

### Retry Automático
- ✅ Até 3 tentativas por vídeo
- ✅ Volta para "pending" se falhar
- ✅ Marca como "failed" após 3 tentativas

### Monitoramento em Tempo Real
- ✅ Indicador visual na página de vídeos
- ✅ Atualização automática via Supabase Realtime
- ✅ Mostra posição na fila
- ✅ Exibe status de cada item

### Limpeza Automática
- ✅ Função `cleanup_old_queue_items()`
- ✅ Remove itens completados/falhados após 7 dias
- ✅ Mantém banco de dados limpo

## 📊 Status dos Vídeos

| Status | Descrição | Cor |
|--------|-----------|-----|
| Na fila | Aguardando processamento | Cinza (outline) |
| Processando | Sendo processado agora | Amarelo (secondary) |
| Concluído | Processamento finalizado | Verde (default) |
| Falha | Erro após 3 tentativas | Vermelho (destructive) |

## 🔧 Configuração

### 1. Aplicar Migration

```bash
# Via Supabase CLI
supabase db push

# Ou via Dashboard
# Cole o conteúdo de supabase/migrations/20240123000000_create_video_queue.sql
```

### 2. Deploy das Edge Functions

```bash
# Deploy process-video-queue
supabase functions deploy process-video-queue

# Verificar se process-video já está deployada
supabase functions list
```

### 3. Testar

```bash
# Compartilhe 2-3 vídeos rapidamente
# Observe o indicador de fila aparecer
# Veja os vídeos sendo processados sequencialmente
```

## 🎨 Interface do Usuário

### Indicador de Fila

Aparece automaticamente quando há vídeos na fila:

```
┌─────────────────────────────────────────┐
│ 🔄 Fila de Processamento                │
│                                          │
│ 🔄 1 processando  ⏰ 2 na fila          │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ 🔄 Processando agora...              │ │
│ │ Em andamento                         │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ ⏰ Posição 1 na fila                 │ │
│ │ Aguardando                           │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ ⏰ Posição 2 na fila                 │ │
│ │ Aguardando                           │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Toast Notifications

- **Posição 1**: "Vídeo adicionado! Processamento iniciando agora..."
- **Posição > 1**: "Vídeo adicionado à fila! Posição: X"

## 🔍 Funções SQL Úteis

### Ver fila completa
```sql
SELECT * FROM video_queue 
WHERE status IN ('pending', 'processing')
ORDER BY priority DESC, created_at ASC;
```

### Ver posição de um vídeo
```sql
SELECT get_queue_position('video-id-aqui');
```

### Limpar itens antigos
```sql
SELECT cleanup_old_queue_items();
```

### Resetar fila (desenvolvimento)
```sql
-- CUIDADO: Apenas em desenvolvimento!
UPDATE video_queue SET status = 'pending', started_at = NULL 
WHERE status = 'processing';
```

## 🐛 Troubleshooting

### Vídeo travado em "processing"

```sql
-- Verificar se há vídeos travados
SELECT * FROM video_queue 
WHERE status = 'processing' 
AND started_at < NOW() - INTERVAL '30 minutes';

-- Resetar para pending
UPDATE video_queue 
SET status = 'pending', started_at = NULL
WHERE id = 'queue-item-id';

-- Disparar processamento novamente
-- Via Supabase Dashboard > Edge Functions > process-video-queue > Invoke
```

### Fila não está processando

1. Verificar se há itens pendentes:
```sql
SELECT COUNT(*) FROM video_queue WHERE status = 'pending';
```

2. Verificar logs da Edge Function:
```bash
supabase functions logs process-video-queue
```

3. Disparar manualmente:
```bash
supabase functions invoke process-video-queue --data '{}'
```

### Vídeo falhou 3 vezes

```sql
-- Ver erro
SELECT video_id, error_message, attempts 
FROM video_queue 
WHERE status = 'failed';

-- Resetar para tentar novamente
UPDATE video_queue 
SET status = 'pending', attempts = 0, error_message = NULL
WHERE video_id = 'video-id-aqui';
```

## 📈 Melhorias Futuras

- [ ] Dashboard de monitoramento da fila
- [ ] Notificações push quando vídeo for processado
- [ ] Priorização automática baseada em tipo de usuário
- [ ] Processamento paralelo para diferentes plataformas
- [ ] Estatísticas de tempo médio de processamento
- [ ] Pausar/retomar fila
- [ ] Cancelar vídeo na fila

## 🎉 Benefícios

✅ **Confiabilidade**: Processamento garantido sem conflitos
✅ **Transparência**: Usuário vê exatamente onde está na fila
✅ **Resiliência**: Retry automático em caso de falha
✅ **Escalabilidade**: Fácil adicionar mais workers no futuro
✅ **Manutenibilidade**: Código organizado e bem documentado
✅ **UX**: Feedback visual claro e em tempo real
