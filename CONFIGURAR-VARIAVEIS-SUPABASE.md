# ⚙️ Configurar Variáveis de Ambiente no Supabase

## ✅ Deploy Concluído

A edge function `process-video` foi atualizada com sucesso (versão 46).

## 🔑 Próximo Passo: Configurar Variáveis de Ambiente

A edge function agora está deployada, mas precisa das variáveis de ambiente para
funcionar.

### Como Configurar:

1. **Acesse o Dashboard do Supabase:**
   https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/settings/functions

2. **Vá em Settings > Edge Functions**

3. **Role até a seção "Secrets"**

4. **Adicione as seguintes variáveis:**

#### Variáveis Obrigatórias:

```bash
# OpenAI API Key (CRÍTICA - sem ela nada funciona)
OPENAI_API_KEY=sk-...

# Supabase URL
SUPABASE_URL=https://enkpfnqsjjnanlqhjnsv.supabase.co

# Supabase Service Role Key (encontre em Settings > API)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Variáveis Opcionais:

```bash
# RapidAPI Key (para Instagram - já está no .env local)
RAPIDAPI_KEY=5b4ef30d7amsh604c58627ce5d90p18121bjsnbc0f5b169f67

# YouTube API Key (opcional, para vídeos do YouTube)
YOUTUBE_API_KEY=...
```

### Como Obter as Chaves:

#### 1. OpenAI API Key (OBRIGATÓRIA)

- Acesse: https://platform.openai.com/api-keys
- Faça login ou crie uma conta
- Clique em "Create new secret key"
- Copie a chave (começa com `sk-`)
- **IMPORTANTE:** Você precisa ter créditos na conta OpenAI

#### 2. Supabase Service Role Key

- No dashboard do Supabase:
  https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/settings/api
- Role até "Project API keys"
- Copie a chave **service_role** (NÃO a anon key!)

#### 3. RapidAPI Key (Opcional)

- Já está configurada: `5b4ef30d7amsh604c58627ce5d90p18121bjsnbc0f5b169f67`
- Verifique se ainda tem créditos em: https://rapidapi.com/dashboard

## 🧪 Testar Após Configurar

1. Compartilhe um novo vídeo do Instagram ou YouTube
2. Aguarde 10-30 segundos
3. Recarregue a página de vídeos
4. O vídeo deve aparecer com título, resumo e categoria

## 📊 Ver Logs

Para verificar se está funcionando:

https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/functions/process-video/logs

Procure por:

- ✅ `Video processed successfully`
- ❌ `OPENAI_API_KEY not configured` (se aparecer, a variável não foi
  configurada)

## 🔄 Reprocessar Vídeos Antigos

Depois de configurar as variáveis, reprocesse os vídeos que falharam:

```bash
node reprocess-failed-videos.js
```

## ⚠️ Importante

- **Sem a OPENAI_API_KEY, NADA vai funcionar**
- A edge function agora valida se a chave existe antes de processar
- Vídeos sem dados processados serão marcados como "Falha" (não mais
  "Concluído")

---

**Status:** ✅ Deploy concluído | ⏳ Aguardando configuração de variáveis
