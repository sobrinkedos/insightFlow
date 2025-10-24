# 🚀 Deploy do Sistema de Filas

## Passo a Passo Rápido

### 1️⃣ Aplicar Migration no Supabase

**Opção A: Via Dashboard (Recomendado)**

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Clique em **New Query**
5. Cole o conteúdo de `supabase/migrations/20240123000000_create_video_queue.sql`
6. Clique em **Run** (ou pressione Ctrl+Enter)
7. Verifique se apareceu "Success. No rows returned"

**Opção B: Via CLI**

```bash
# Se tiver Supabase CLI instalado
supabase db push
```

### 2️⃣ Deploy da Nova Edge Function

```bash
# Deploy da função de processamento de fila
supabase functions deploy process-video-queue
```

**Ou via Dashboard:**

1. Vá em **Edge Functions**
2. Clique em **Deploy new function**
3. Nome: `process-video-queue`
4. Cole o código de `supabase/functions/process-video-queue/index.ts`
5. Clique em **Deploy**

### 3️⃣ Verificar Variáveis de Ambiente

As Edge Functions precisam das mesmas variáveis que já estão configuradas:

```bash
SUPABASE_URL=sua-url
SUPABASE_SERVICE_ROLE_KEY=sua-key
OPENAI_API_KEY=sua-key
YOUTUBE_API_KEY=sua-key (opcional)
```

Não precisa adicionar nada novo! ✅

### 4️⃣ Testar o Sistema

1. **Compartilhe 2-3 vídeos rapidamente**
   - Use o botão "Compartilhar Vídeo"
   - Cole URLs de vídeos do Instagram ou YouTube
   - Clique em "Adicionar à Fila" várias vezes

2. **Observe o indicador de fila**
   - Deve aparecer automaticamente na página de vídeos
   - Mostra quantos vídeos estão processando e aguardando
   - Atualiza em tempo real

3. **Verifique os status**
   - Primeiro vídeo: "Processando"
   - Outros vídeos: "Na fila" com posição
   - Após processar: "Concluído"

### 5️⃣ Verificar se Está Funcionando

**Via SQL Editor:**

```sql
-- Ver todos os itens na fila
SELECT 
  vq.*,
  v.title,
  v.url,
  v.status as video_status
FROM video_queue vq
JOIN videos v ON v.id = vq.video_id
ORDER BY vq.created_at DESC
LIMIT 10;

-- Ver apenas pendentes/processando
SELECT * FROM video_queue 
WHERE status IN ('pending', 'processing')
ORDER BY priority DESC, created_at ASC;
```

**Via Logs:**

```bash
# Ver logs da fila
supabase functions logs process-video-queue --tail

# Ver logs do processamento
supabase functions logs process-video --tail
```

## 🎯 Checklist de Deploy

- [ ] Migration aplicada com sucesso
- [ ] Tabela `video_queue` criada
- [ ] Função `get_queue_position` criada
- [ ] Função `cleanup_old_queue_items` criada
- [ ] Edge Function `process-video-queue` deployada
- [ ] Variáveis de ambiente configuradas
- [ ] Teste com 2-3 vídeos funcionando
- [ ] Indicador de fila aparecendo
- [ ] Vídeos processando sequencialmente

## ⚠️ Problemas Comuns

### Migration falhou

**Erro**: "relation video_queue already exists"

**Solução**: A tabela já existe, tudo certo! ✅

---

**Erro**: "permission denied"

**Solução**: Use o SQL Editor do Dashboard com permissões de admin

---

### Edge Function não deploya

**Erro**: "Function already exists"

**Solução**: 
```bash
# Forçar redeploy
supabase functions deploy process-video-queue --no-verify-jwt
```

---

### Vídeos não entram na fila

**Verificar**:
1. Console do navegador (F12) - procure por erros
2. Tabela `video_queue` no Supabase - tem registros?
3. Status do vídeo - está "Na fila"?

**Solução**:
```sql
-- Verificar se RLS está permitindo inserção
SELECT * FROM video_queue WHERE user_id = 'seu-user-id';

-- Se vazio, verificar policies
SELECT * FROM pg_policies WHERE tablename = 'video_queue';
```

---

### Fila não processa

**Verificar**:
```sql
-- Há vídeos travados em processing?
SELECT * FROM video_queue 
WHERE status = 'processing' 
AND started_at < NOW() - INTERVAL '30 minutes';
```

**Solução**:
```sql
-- Resetar vídeos travados
UPDATE video_queue 
SET status = 'pending', started_at = NULL
WHERE status = 'processing' 
AND started_at < NOW() - INTERVAL '30 minutes';

-- Disparar processamento
-- Via Dashboard > Edge Functions > process-video-queue > Invoke
```

## 🧪 Teste Completo

### Cenário 1: Vídeo Único
1. Compartilhe 1 vídeo
2. Deve mostrar: "Vídeo adicionado! Processamento iniciando agora..."
3. Status: "Processando" → "Concluído"
4. Indicador de fila NÃO aparece (só 1 vídeo)

### Cenário 2: Múltiplos Vídeos
1. Compartilhe 3 vídeos rapidamente
2. Deve mostrar: "Vídeo adicionado à fila! Posição: 1", "Posição: 2", "Posição: 3"
3. Indicador de fila APARECE
4. Vídeos processam um por vez
5. Indicador desaparece quando todos concluídos

### Cenário 3: Erro e Retry
1. Compartilhe vídeo com URL inválida
2. Deve tentar 3 vezes
3. Após 3 tentativas: status "Falha"
4. Próximo vídeo da fila processa normalmente

## 📊 Monitoramento

### Dashboard SQL

Crie uma query salva no SQL Editor:

```sql
-- Dashboard da Fila
SELECT 
  status,
  COUNT(*) as total,
  AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) as avg_processing_time_seconds
FROM video_queue
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY status;
```

### Alertas

Configure alertas no Supabase para:
- Vídeos travados em "processing" por mais de 30 minutos
- Taxa de falha acima de 20%
- Fila com mais de 10 vídeos pendentes

## 🎉 Pronto!

Se todos os checkpoints passaram, o sistema de filas está funcionando! 

Agora você pode compartilhar múltiplos vídeos sem se preocupar com conflitos na API. 🚀

## 📞 Suporte

Se algo não funcionar:

1. Verifique os logs das Edge Functions
2. Consulte a tabela `video_queue` no SQL Editor
3. Revise o arquivo `SISTEMA-FILAS.md` para troubleshooting detalhado
