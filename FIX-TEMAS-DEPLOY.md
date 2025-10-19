# Fix: Criação Automática de Temas

## Problema Identificado
A Edge Function `process-video` não estava criando temas automaticamente nem vinculando os vídeos aos temas na tabela `theme_videos`.

## Solução Implementada
Adicionei código na função `process-video` que:
1. Verifica se já existe um tema com a categoria do vídeo
2. Se não existir, cria um novo tema
3. Vincula o vídeo ao tema na tabela `theme_videos`

## Como Fazer o Deploy

### Opção 1: Via Supabase CLI (Recomendado)
```bash
# 1. Fazer login no Supabase (se ainda não estiver logado)
npx supabase login

# 2. Linkar ao projeto
npx supabase link --project-ref enkpfnqsjjnanlqhjnsv

# 3. Fazer deploy da função atualizada
npx supabase functions deploy process-video
```

### Opção 2: Via Dashboard do Supabase
1. Acesse: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/functions
2. Clique na função `process-video`
3. Clique em "Edit function"
4. Copie o conteúdo do arquivo `supabase/functions/process-video/index.ts`
5. Cole no editor e salve

## Testando a Correção

### 1. Processar um vídeo novo
Adicione um novo vídeo e aguarde o processamento.

### 2. Verificar se o tema foi criado
Execute no SQL Editor do Supabase:
```sql
-- Ver todos os temas do usuário
SELECT * FROM themes WHERE user_id = 'SEU_USER_ID';

-- Ver vídeos vinculados aos temas
SELECT 
  t.title as tema,
  v.title as video,
  v.category,
  v.created_at
FROM themes t
JOIN theme_videos tv ON t.id = tv.theme_id
JOIN videos v ON tv.video_id = v.id
WHERE t.user_id = 'SEU_USER_ID'
ORDER BY v.created_at DESC;
```

### 3. Reprocessar vídeos antigos (opcional)
Se você quiser criar temas para vídeos já processados:
```sql
-- Ver vídeos sem tema
SELECT v.id, v.title, v.category
FROM videos v
LEFT JOIN theme_videos tv ON v.id = tv.video_id
WHERE tv.video_id IS NULL
  AND v.status = 'Concluído'
  AND v.category IS NOT NULL;
```

Para reprocessar, você pode chamar a função manualmente via SQL:
```sql
SELECT extensions.http_post(
  url := 'https://enkpfnqsjjnanlqhjnsv.supabase.co/functions/v1/process-video',
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'Authorization', 'Bearer SEU_SERVICE_ROLE_KEY'
  ),
  body := jsonb_build_object('video_id', 'VIDEO_ID_AQUI')
);
```

## Logs para Debug
Após o deploy, você pode ver os logs da função:
```bash
npx supabase functions logs process-video
```

Ou no dashboard: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/logs/edge-functions

## O Que Foi Alterado
- Arquivo: `supabase/functions/process-video/index.ts`
- Adicionado: Seção 8 que cria/vincula temas automaticamente
- Comportamento: Após processar o vídeo, a função agora:
  - Busca tema existente com a mesma categoria
  - Se não existir, cria um novo tema
  - Vincula o vídeo ao tema na tabela `theme_videos`
