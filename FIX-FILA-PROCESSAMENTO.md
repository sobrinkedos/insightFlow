# 🔧 Fix: Problema no Processamento da Fila

## 📋 Diagnóstico

### Problema Identificado

1. **Vídeo travado**: ID `ba77bfc1-7ca4-4737-b112-20f4ff96b748`
   - Status: "Na fila" há 37+ minutos
   - Queue status: "pending" com erro anterior
   - Error: "Edge Function returned a non-2xx status code"

2. **Edge Function com erro 400**:
   - `process-video-queue` versão 2 retornando 400
   - Múltiplas tentativas falhando
   - Função SQL `get_next_from_queue` funciona corretamente

### Causa Raiz

A edge function `process-video-queue` versão 2 **NÃO FOI DEPLOYADA** ainda!

Fizemos as alterações no código mas não fizemos o deploy. A versão 1 não tem suporte para:
- Processamento paralelo por plataforma
- Função `get_next_from_queue`
- Controle de slots por plataforma

## ✅ Solução

### 1. Resetar Vídeo Travado

```sql
-- JÁ FEITO ✅
UPDATE video_queue 
SET status = 'pending', 
    started_at = NULL,
    attempts = 0,
    error_message = NULL
WHERE id = '91cde927-4ea3-41c9-8b8d-5499c647bca6';
```

### 2. Deploy da Edge Function Atualizada

**URGENTE**: Fazer deploy de `process-video-queue` versão 2

**Via Dashboard:**
1. Acesse: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/functions/24d2a2e2-06d2-4028-8245-498fa0c28143
2. Clique em "Edit"
3. Cole o conteúdo de `supabase/functions/process-video-queue/index.ts`
4. Deploy

**Via CLI:**
```bash
supabase functions deploy process-video-queue
```

### 3. Testar Processamento

Após o deploy, disparar manualmente:

```javascript
// Via Dashboard > Edge Functions > process-video-queue > Invoke
{}
```

Ou via código:
```typescript
await supabase.functions.invoke('process-video-queue', { body: {} });
```

## 🐛 Problemas Adicionais Encontrados

### Timeouts (504)

Vários vídeos dando timeout de 150 segundos:
- Instagram com Whisper demora muito
- Vídeos grandes ultrapassam limite

**Solução temporária**: Já implementada no código
- Limite de 25MB para Whisper
- Fallback se Whisper falhar

**Solução definitiva**: Processar Whisper em função separada

### Erros 400 Recorrentes

Após deploy da versão 2, se continuar:

1. **Verificar logs detalhados**:
```bash
supabase functions logs process-video-queue --tail
```

2. **Testar função SQL**:
```sql
SELECT * FROM get_next_from_queue('youtube');
SELECT * FROM get_next_from_queue(NULL);
```

3. **Verificar se migration foi aplicada**:
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'video_queue' AND column_name = 'platform';
```

## 📊 Status Atual

### Fila
- ✅ Migration aplicada
- ✅ Funções SQL criadas e funcionando
- ✅ Vídeo travado resetado
- ❌ Edge Function versão 2 NÃO deployada

### Vídeos
- 1 vídeo YouTube aguardando processamento
- 0 vídeos em processamento
- Fila limpa e pronta

## 🚀 Próximos Passos

1. **URGENTE**: Deploy da `process-video-queue` versão 2
2. Testar processamento do vídeo YouTube
3. Monitorar logs para novos erros
4. Se funcionar, testar com Instagram

## 📝 Checklist

- [x] Diagnosticar problema
- [x] Resetar vídeo travado
- [x] Verificar funções SQL
- [ ] Deploy edge function versão 2
- [ ] Testar processamento
- [ ] Monitorar logs
- [ ] Confirmar funcionamento

## 🎯 Resultado Esperado

Após o deploy:
- Vídeo YouTube deve processar em ~30 segundos
- Fila deve funcionar normalmente
- Processamento paralelo ativo
- Sem erros 400
