# Suporte ao Instagram - Processamento de Vídeos

## ✅ Deploy Concluído

A função Edge `process-video` foi atualizada e implantada com sucesso (versão 17) para suportar vídeos do Instagram além do YouTube.

**Status**: ✅ Ativo e funcionando
**Projeto**: insightFlow (enkpfnqsjjnanlqhjnsv)
**Versão**: 17
**Data**: 18/10/2025

## ✅ Mudanças Implementadas

### Alterações no Código

1. **Função `extractVideoId`** - Agora retorna objeto com `id` e `platform`:
   - Detecta URLs do YouTube: `youtube.com/watch?v=ID` ou `youtu.be/ID`
   - Detecta URLs do Instagram: `instagram.com/p/ID`, `instagram.com/reel/ID`, `instagram.com/tv/ID`

2. **Função `getVideoInfo`** - Agora aceita parâmetro `platform`:
   - Para YouTube: usa YouTube Data API v3 (requer `YOUTUBE_API_KEY`)
   - Para Instagram: usa Facebook Graph API oEmbed (opcional `INSTAGRAM_ACCESS_TOKEN`)
   - Fallback genérico para ambas plataformas

3. **Processamento Principal** - Adaptado para múltiplas plataformas:
   - Identifica automaticamente a plataforma pela URL
   - Usa a API apropriada para cada plataforma
   - Mensagens de erro mais descritivas

## 🚀 Como Fazer o Deploy

### Opção 1: Via Supabase CLI (Recomendado)

```bash
# Instale o Supabase CLI se ainda não tiver
npm install -g supabase

# Faça login
supabase login

# Link com seu projeto
supabase link --project-ref SEU_PROJECT_REF

# Deploy da função
supabase functions deploy process-video
```

### Opção 2: Via Dashboard do Supabase

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Vá em **Edge Functions** no menu lateral
3. Clique em **process-video**
4. Clique em **Edit Function**
5. Cole o código atualizado de `supabase/functions/process-video/index.ts`
6. Clique em **Deploy**

## 🔑 Variáveis de Ambiente (Secrets)

Configure no Dashboard do Supabase em **Settings > Edge Functions > Secrets**:

### Obrigatórias
- `SUPABASE_URL` - URL do seu projeto Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key
- `OPENAI_API_KEY` - Chave da API OpenAI para análise com GPT

### Opcionais (para melhor qualidade)
- `YOUTUBE_API_KEY` - Para obter título e descrição de vídeos do YouTube
- `INSTAGRAM_ACCESS_TOKEN` - Para obter informações de vídeos do Instagram

## 📝 Formatos de URL Suportados

### YouTube
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`

### Instagram
- `https://www.instagram.com/p/POST_ID/`
- `https://www.instagram.com/reel/REEL_ID/`
- `https://www.instagram.com/tv/TV_ID/`

## 🧪 Como Testar

1. Faça o deploy da função atualizada
2. No app, clique em "Compartilhar Vídeo"
3. Cole uma URL do Instagram (ex: `https://www.instagram.com/reel/ABC123/`)
4. Clique em "Adicionar à Fila"
5. O vídeo deve ser processado com sucesso

## ⚠️ Limitações Atuais

- **Instagram sem token**: Sem `INSTAGRAM_ACCESS_TOKEN`, o sistema usa informações genéricas
- **Transcrição de áudio**: Ainda não implementada para nenhuma plataforma
- **Análise baseada em descrição**: A IA analisa a descrição/título do vídeo, não o conteúdo visual
- **Player do Instagram**: O Instagram não permite embed direto de vídeos. O player mostra um botão para abrir o vídeo no Instagram

## 🔄 Próximos Passos

Para melhorar o suporte ao Instagram:

1. **Obter Instagram Access Token**:
   - Crie um app no [Facebook Developers](https://developers.facebook.com/)
   - Configure Instagram Basic Display API
   - Gere um token de acesso
   - Adicione como secret no Supabase

2. **Implementar transcrição de áudio**:
   - Usar yt-dlp para baixar áudio
   - Enviar para OpenAI Whisper API
   - Processar transcrição completa

3. **Adicionar mais plataformas**:
   - TikTok
   - Vimeo
   - Dailymotion

## 🐛 Troubleshooting

### Erro 400: "URL de vídeo inválida ou plataforma não suportada"
- Verifique se a URL está no formato correto
- Certifique-se de que é uma URL do YouTube ou Instagram

### Erro: "OPENAI_API_KEY not configured"
- Configure a variável de ambiente no Dashboard do Supabase

### Vídeo fica em "Processando" indefinidamente
- Verifique os logs da função Edge no Dashboard
- Pode ser erro na API do OpenAI ou problema de rede
