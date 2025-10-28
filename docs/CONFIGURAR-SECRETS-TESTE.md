# Configurar Secrets no Projeto de Teste

## Problema Atual

As Edge Functions estão retornando erro 400 porque faltam variáveis de ambiente
(secrets) configuradas no projeto Supabase de teste.

## Variáveis Necessárias

### Obrigatórias

1. **OPENAI_API_KEY** (Obrigatório)
   - Necessária para análise de vídeos com GPT
   - Sem ela, a função `process-video` falha imediatamente
   - Obtenha em: https://platform.openai.com/api-keys

### Opcionais (mas recomendadas)

2. **YOUTUBE_API_KEY** (Opcional)
   - Melhora a qualidade dos metadados de vídeos do YouTube
   - Sem ela, usa informações básicas
   - Obtenha em: https://console.cloud.google.com/apis/credentials

3. **RAPIDAPI_KEY** (Opcional)
   - Necessária para processar vídeos do Instagram
   - Já temos uma chave: `5b4ef30d7amsh604c58627ce5d90p18121bjsnbc0f5b169f67`
   - API: instagram-downloader-download-instagram-stories-videos4

## Como Configurar

### Opção 1: Via Dashboard (Recomendado)

1. Acesse:
   https://supabase.com/dashboard/project/bosxuteortfshfysoqrd/settings/vault/secrets

2. Clique em "New secret"

3. Adicione cada variável:
   ```
   Nome: OPENAI_API_KEY
   Valor: sk-proj-...
   ```

4. Repita para as outras variáveis

### Opção 2: Via CLI (se tiver instalado)

```bash
# Configurar OPENAI_API_KEY
supabase secrets set OPENAI_API_KEY=sk-proj-... --project-ref bosxuteortfshfysoqrd

# Configurar YOUTUBE_API_KEY (opcional)
supabase secrets set YOUTUBE_API_KEY=AIza... --project-ref bosxuteortfshfysoqrd

# Configurar RAPIDAPI_KEY (opcional)
supabase secrets set RAPIDAPI_KEY=5b4ef30d7amsh604c58627ce5d90p18121bjsnbc0f5b169f67 --project-ref bosxuteortfshfysoqrd
```

## Verificar Configuração

Após configurar as secrets:

1. As Edge Functions reiniciam automaticamente
2. Tente adicionar um vídeo novamente
3. Verifique os logs em:
   https://supabase.com/dashboard/project/bosxuteortfshfysoqrd/logs/edge-functions

## Status Atual

✅ Secrets configuradas no dashboard ✅ Bucket `video-thumbnails` criado ✅
Coluna `username` adicionada ✅ Função `reset_stuck_videos` criada

❌ **Problema**: Edge Functions ainda retornam erro 400

## Diagnóstico

Os logs do Supabase não mostram o erro detalhado (console.log interno).
Possíveis causas:

1. **Erro na chamada da OpenAI API** - A chave pode estar incorreta ou sem
   créditos
2. **Erro na YouTube API** - A chave pode estar incorreta ou sem quota
3. **Timeout** - A função pode estar demorando muito (>60s)
4. **Erro de parsing** - Algum problema ao processar a resposta da API

## Próximos Passos

### Opção 1: Testar no Projeto de Produção

O projeto de produção (`enkpfnqsjjnanlqhjnsv`) provavelmente já está
funcionando. Teste lá primeiro para confirmar que o código está correto.

### Opção 2: Verificar Logs Detalhados

1. Acesse:
   https://supabase.com/dashboard/project/bosxuteortfshfysoqrd/logs/edge-functions
2. Clique em um log de erro específico
3. Veja se há mais detalhes no console.log

### Opção 3: Testar Variáveis de Ambiente

Criei uma função de teste em `supabase/functions/test-env/index.ts`. Para
deployar e testar:

```bash
# Deploy da função de teste
supabase functions deploy test-env --project-ref bosxuteortfshfysoqrd

# Testar via curl
curl https://bosxuteortfshfysoqrd.supabase.co/functions/v1/test-env \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### Opção 4: Verificar Créditos da OpenAI

Acesse https://platform.openai.com/usage e verifique se há créditos disponíveis.

## Projeto de Produção

O projeto de produção (`enkpfnqsjjnanlqhjnsv`) já deve ter essas variáveis
configuradas e funcionando. Se não tiver, configure da mesma forma.
