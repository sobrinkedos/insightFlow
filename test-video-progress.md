# Teste de Vídeos Assistidos

## Passos para testar:

1. Abra o console do navegador (F12)
2. Assista alguns segundos de um vídeo
3. Verifique os logs no console:
   - `✅ Progresso salvo:` - confirma que o progresso foi salvo
   - `📺 Query de vídeos assistidos:` - mostra os dados retornados
   - `📺 Vídeos assistidos carregados:` - mostra os vídeos processados

## Possíveis problemas:

### 1. Progresso não está sendo salvo
- Verifique se aparece o log `✅ Progresso salvo:`
- Se não aparecer, o problema está no hook `useVideoProgress`

### 2. Query não retorna dados
- Verifique o log `📺 Query de vídeos assistidos:`
- Se `data` estiver vazio ou `error` não for null, há problema na query ou RLS

### 3. Dados não aparecem na UI
- Verifique o log `📺 Vídeos assistidos carregados:`
- Se os dados estão lá mas não aparecem, o problema é no componente

## Teste manual no Supabase:

Execute esta query no SQL Editor do Supabase:

```sql
-- Ver todos os progressos do usuário
SELECT 
  vp.*,
  v.title,
  v.channel
FROM video_progress vp
JOIN videos v ON v.id = vp.video_id
WHERE vp.user_id = auth.uid()
ORDER BY vp.last_watched_at DESC
LIMIT 5;
```

## Verificar RLS:

```sql
-- Ver políticas da tabela video_progress
SELECT * FROM pg_policies WHERE tablename = 'video_progress';
```
