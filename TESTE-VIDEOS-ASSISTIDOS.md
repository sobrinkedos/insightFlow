# 🔍 Teste: Vídeos Assistidos

## O que foi adicionado:

1. **Logs detalhados** no console do navegador
2. **Componente de debug** visível na home (card amarelo)
3. **Subscription em tempo real** para detectar mudanças

## Como testar:

### Passo 1: Abrir o console
- Pressione F12 no navegador
- Vá para a aba "Console"

### Passo 2: Acessar a home
- Acesse a página inicial
- Verifique o card amarelo "🐛 Debug: Video Progress"
- Anote quantos registros aparecem

### Passo 3: Assistir um vídeo
1. Clique em qualquer vídeo
2. Assista por pelo menos 10 segundos
3. Volte para a home

### Passo 4: Verificar os logs

No console, procure por:

```
✅ Progresso salvo: { video_id: "...", watched_time: 10, ... }
```
- Se aparecer: ✅ O progresso está sendo salvo

```
🔔 Mudança detectada em video_progress: { ... }
```
- Se aparecer: ✅ O subscription está funcionando

```
📺 Query de vídeos assistidos: { data: [...], error: null, count: X }
```
- Se `data` tiver itens: ✅ A query está retornando dados
- Se `error` não for null: ❌ Há problema na query ou RLS

```
📺 Vídeos assistidos carregados: { total: X, videos: [...] }
```
- Se `total > 0`: ✅ Os dados estão sendo processados
- Se `total = 0`: ❌ Problema no processamento

### Passo 5: Verificar o card de debug

O card amarelo deve mostrar:
- **Total de registros**: Número de vídeos que você já assistiu
- **Últimos 5 registros**: Lista dos últimos vídeos assistidos

## Possíveis problemas e soluções:

### ❌ Progresso não está sendo salvo
**Sintoma**: Não aparece o log `✅ Progresso salvo:`

**Causa**: O player não está chamando `updateProgress`

**Solução**: Verificar se o player está funcionando corretamente

### ❌ Query retorna erro
**Sintoma**: `error` não é null no log

**Causa**: Problema com RLS ou relacionamento

**Solução**: Executar no SQL Editor do Supabase:
```sql
-- Verificar se há registros
SELECT COUNT(*) FROM video_progress WHERE user_id = auth.uid();

-- Ver os registros
SELECT * FROM video_progress WHERE user_id = auth.uid();
```

### ❌ Subscription não funciona
**Sintoma**: Não aparece `🔔 Mudança detectada`

**Causa**: Realtime não está habilitado

**Solução**: No Supabase Dashboard:
1. Vá em Database > Replication
2. Habilite a tabela `video_progress`

### ❌ Dados não aparecem na UI
**Sintoma**: Logs mostram dados, mas a seção está vazia

**Causa**: Problema no componente de renderização

**Solução**: Verificar se `watchedVideos.length > 0` no código

## Após o teste:

Quando tudo estiver funcionando, remova:
1. O componente `<DebugVideoProgress />` da home
2. Os logs `console.log` extras (opcional, podem ficar para debug futuro)
