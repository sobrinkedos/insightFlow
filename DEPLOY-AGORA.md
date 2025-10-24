# 🚀 DEPLOY AGORA - Otimizações Prontas!

## ✅ Status das Alterações

As otimizações já foram aplicadas automaticamente pelo Kiro IDE:

### ✅ Mudança 1: Processamento Paralelo
**Arquivo**: `supabase/functions/process-video-queue/index.ts`
**Linha 44**: `const MAX_INSTAGRAM = 2;` ✅

### ✅ Mudança 2: Otimização Whisper
**Arquivo**: `supabase/functions/process-video/index.ts`
**Linha 188**: `if (videoSize > 10)` ✅

---

## 🚀 Fazer Deploy AGORA

### Opção 1: Script Automático (Mais Rápido) ⚡

```bash
deploy-otimizacoes.bat
```

### Opção 2: Via Dashboard (Recomendado) 🌐

#### Passo 1: Deploy process-video-queue
1. Acesse: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/functions
2. Clique em **process-video-queue**
3. Clique em **Deploy new version**
4. Copie todo o conteúdo de: `supabase/functions/process-video-queue/index.ts`
5. Cole no editor
6. Clique em **Deploy**
7. Aguarde "Deployment successful" ✅

#### Passo 2: Deploy process-video
1. Na mesma página, clique em **process-video**
2. Clique em **Deploy new version**
3. Copie todo o conteúdo de: `supabase/functions/process-video/index.ts`
4. Cole no editor
5. Clique em **Deploy**
6. Aguarde "Deployment successful" ✅

### Opção 3: Via CLI 💻

```bash
# Fazer login (se necessário)
supabase login

# Deploy das funções
supabase functions deploy process-video-queue
supabase functions deploy process-video
```

---

## 🧪 Testar Imediatamente

### Teste 1: Compartilhar 2 Instagrams (2 minutos)

1. Abra 2 abas do navegador
2. Acesse sua extensão em cada aba
3. Compartilhe 1 Instagram em cada aba
4. **Resultado esperado**: Ambos processam simultaneamente

### Teste 2: Verificar Processamento Paralelo (30 segundos)

Execute no SQL Editor:
```sql
SELECT 
  platform,
  status,
  COUNT(*) as total,
  MAX(started_at) as ultimo_inicio
FROM video_queue
WHERE created_at > NOW() - INTERVAL '10 minutes'
GROUP BY platform, status
ORDER BY platform, status;
```

**Resultado esperado**:
```
instagram | processing | 2
```

### Teste 3: Ver Tempo de Processamento (1 minuto)

```sql
SELECT 
  platform,
  ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - started_at)))) as tempo_medio_seg,
  COUNT(*) as total_processados
FROM video_queue
WHERE status = 'completed'
AND completed_at > NOW() - INTERVAL '1 hour'
GROUP BY platform;
```

**Resultado esperado**:
```
instagram | 45-75 | X
youtube   | 25-35 | X
```

---

## 📊 Monitorar Performance

### Dashboard Rápido

```sql
-- Criar view de monitoramento
CREATE OR REPLACE VIEW queue_dashboard AS
SELECT 
  (SELECT COUNT(*) FROM video_queue WHERE status = 'pending') as pendentes,
  (SELECT COUNT(*) FROM video_queue WHERE status = 'processing') as processando,
  (SELECT COUNT(*) FROM video_queue WHERE status = 'processing' AND platform = 'instagram') as instagram_processando,
  (SELECT ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - started_at)))) 
   FROM video_queue 
   WHERE status = 'completed' 
   AND platform = 'instagram'
   AND completed_at > NOW() - INTERVAL '1 hour') as tempo_medio_instagram_seg;

-- Ver dashboard
SELECT * FROM queue_dashboard;
```

**Resultado esperado**:
```
pendentes: 0-5
processando: 2-4
instagram_processando: 0-2
tempo_medio_instagram_seg: 45-75
```

---

## 🎯 Checklist de Verificação

Após o deploy, verifique:

- [ ] Deploy de `process-video-queue` concluído
- [ ] Deploy de `process-video` concluído
- [ ] 2 Instagrams processam simultaneamente
- [ ] Tempo médio < 90 segundos
- [ ] Vídeos grandes (>10MB) processam em 30-60s
- [ ] Logs mostram "Video too large for Whisper API (>10MB)"

---

## 🐛 Troubleshooting

### Deploy falhou?

**Erro comum**: "Function not found"
**Solução**: Use a Opção 2 (Dashboard) ao invés da CLI

### Fila não processa?

```sql
-- Disparar manualmente
SELECT supabase.functions.invoke('process-video-queue', '{}');
```

### Ainda processa 1 por vez?

1. Verifique se o deploy foi feito corretamente
2. Execute no SQL Editor:
```sql
-- Ver código deployado (não é possível via SQL, use Dashboard)
```
3. Acesse Dashboard > Functions > process-video-queue > Logs
4. Procure por: "Currently processing: {youtube: X, instagram: X}"

### Tempo ainda alto (> 120s)?

1. Verifique se vídeos grandes estão pulando Whisper
2. Execute no Dashboard > Functions > process-video > Logs
3. Procure por: "Video too large for Whisper API (>10MB)"

---

## 📈 Resultados Esperados

### Antes das Otimizações
- ❌ 1 Instagram por vez
- ❌ 2-3 minutos por vídeo
- ❌ Whisper sempre executado

### Depois das Otimizações
- ✅ 2 Instagrams simultâneos
- ✅ 30-90 segundos por vídeo
- ✅ Whisper pulado para vídeos grandes

### Ganhos
| Cenário | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Instagram pequeno | 2-3 min | 60-90s | **2x** |
| Instagram grande | 2-3 min | 30-60s | **4x** |
| 2 Instagrams | 4-6 min | 60-90s | **4x** |

---

## 🎉 Próximos Passos

### Imediato
1. ✅ Fazer deploy (escolha uma das 3 opções)
2. ✅ Testar com 2 Instagrams
3. ✅ Verificar tempo de processamento

### Opcional (Melhorias Futuras)
1. ⏳ Deploy do cron job (`queue-cron`)
2. ⏳ Configurar cron job no Supabase (a cada 30s)
3. ⏳ Ajustar limite do Whisper (5MB ao invés de 10MB)

---

## 📞 Links Úteis

- **Dashboard Functions**: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/functions
- **SQL Editor**: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/sql
- **Logs**: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/logs

---

## 📚 Documentação Completa

- `COMECE-AQUI.md` - Guia rápido (3 minutos)
- `README-OTIMIZACOES.md` - Resumo completo
- `COMANDOS-RAPIDOS.md` - Comandos SQL prontos
- `CHECKLIST-COMPLETO.md` - Checklist detalhado
- `DIAGRAMA-OTIMIZACOES.md` - Diagramas visuais

---

**Pronto! Faça o deploy agora e tenha Instagram 2-4x mais rápido!** 🚀

**Tempo estimado**: 5 minutos para deploy + teste
**Resultado**: Instagram processando em 30-90 segundos ✅
