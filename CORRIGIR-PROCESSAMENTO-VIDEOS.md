# 🔧 Corrigir Processamento de Vídeos

## Problema Identificado

Os vídeos estão sendo marcados como "Concluído" mas sem dados processados (título, resumo, etc.). Isso acontece porque a edge function `process-video` não está conseguindo processar os vídeos corretamente.

## Causa Raiz

As **variáveis de ambiente não estão configuradas no Supabase**. A edge function precisa dessas variáveis para funcionar:

1. `OPENAI_API_KEY` - Para processar com GPT-4
2. `RAPIDAPI_KEY` - Para buscar informações do Instagram  
3. `SUPABASE_URL` - URL do projeto Supabase
4. `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço do Supabase

## Solução: Configurar Variáveis de Ambiente no Supabase

### Passo 1: Acessar o Dashboard do Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto: `enkpfnqsjjnanlqhjnsv`

### Passo 2: Configurar as Variáveis de Ambiente

1. No menu lateral, clique em **Settings** (Configurações)
2. Clique em **Edge Functions**
3. Role até a seção **Secrets** (Segredos)
4. Adicione as seguintes variáveis:

#### Variáveis Obrigatórias:

```bash
# OpenAI API Key (obrigatória para processamento com GPT)
OPENAI_API_KEY=sua-chave-openai-aqui

# RapidAPI Key (para Instagram)
RAPIDAPI_KEY=5b4ef30d7amsh604c58627ce5d90p18121bjsnbc0f5b169f67

# Supabase URL
SUPABASE_URL=https://enkpfnqsjjnanlqhjnsv.supabase.co

# Supabase Service Role Key (encontre em Settings > API)
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
```

#### Variáveis Opcionais:

```bash
# YouTube API Key (opcional, para vídeos do YouTube)
YOUTUBE_API_KEY=sua-chave-youtube-aqui
```

### Passo 3: Obter a OpenAI API Key

Se você ainda não tem uma chave da OpenAI:

1. Acesse: https://platform.openai.com/api-keys
2. Faça login ou crie uma conta
3. Clique em **Create new secret key**
4. Copie a chave e adicione no Supabase

**Importante:** A OpenAI cobra por uso. Verifique os preços em: https://openai.com/pricing

### Passo 4: Obter a Service Role Key

1. No dashboard do Supabase, vá em **Settings** > **API**
2. Role até **Project API keys**
3. Copie a chave **service_role** (não a anon key!)
4. Adicione no Supabase como `SUPABASE_SERVICE_ROLE_KEY`

### Passo 5: Reprocessar Vídeos Existentes

Depois de configurar as variáveis, você pode reprocessar os vídeos que falharam:

1. Acesse a página de vídeos no app
2. Para cada vídeo "Concluído" sem dados:
   - Delete o vídeo
   - Compartilhe novamente a URL

Ou use o script de reprocessamento (veja abaixo).

## Script de Reprocessamento (Opcional)

Se você quiser reprocessar todos os vídeos "Concluído" sem dados automaticamente:

```javascript
// reprocess-videos.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://enkpfnqsjjnanlqhjnsv.supabase.co';
const supabaseKey = 'sua-anon-key-aqui';

const supabase = createClient(supabaseUrl, supabaseKey);

async function reprocessVideos() {
  // 1. Buscar vídeos "Concluído" sem dados
  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .eq('status', 'Concluído')
    .is('title', null);
  
  console.log(`Encontrados ${videos?.length || 0} vídeos para reprocessar`);
  
  // 2. Marcar como "Processando" e chamar edge function
  for (const video of videos || []) {
    console.log(`Reprocessando vídeo ${video.id}...`);
    
    await supabase
      .from('videos')
      .update({ status: 'Processando' })
      .eq('id', video.id);
    
    await supabase.functions.invoke('process-video', {
      body: { video_id: video.id }
    });
  }
  
  console.log('Reprocessamento iniciado!');
}

reprocessVideos();
```

## Verificar se Funcionou

Após configurar as variáveis:

1. Compartilhe um novo vídeo do Instagram ou YouTube
2. Aguarde alguns segundos
3. Recarregue a página de vídeos
4. O vídeo deve aparecer com título, resumo e categoria

## Logs da Edge Function

Para ver os logs e debugar problemas:

1. No dashboard do Supabase, vá em **Edge Functions**
2. Clique em **process-video**
3. Clique na aba **Logs**
4. Você verá os logs de execução em tempo real

Procure por erros como:
- `OPENAI_API_KEY not configured`
- `RAPIDAPI_KEY not configured`
- `Error fetching video info`
- `Error processing video`

## Problemas Comuns

### 1. Vídeo fica em "Processando" para sempre

**Causa:** Edge function está falhando silenciosamente

**Solução:** 
- Verifique os logs da edge function
- Confirme que todas as variáveis estão configuradas
- Teste a OpenAI API Key manualmente

### 2. Instagram não funciona

**Causa:** RapidAPI pode estar com limite excedido ou chave inválida

**Solução:**
- Verifique sua conta RapidAPI: https://rapidapi.com/dashboard
- Confirme que a API "Instagram Downloader (videos4)" está ativa
- Verifique se não excedeu o limite gratuito

### 3. YouTube não funciona

**Causa:** YOUTUBE_API_KEY não configurada (opcional)

**Solução:**
- Configure a YOUTUBE_API_KEY (veja Passo 2)
- Ou deixe sem configurar - o sistema usará informações básicas

## Contato

Se o problema persistir após seguir todos os passos, verifique:

1. ✅ Todas as variáveis de ambiente estão configuradas no Supabase
2. ✅ A OpenAI API Key é válida e tem créditos
3. ✅ A RapidAPI Key é válida e não excedeu o limite
4. ✅ Os logs da edge function não mostram erros

---

**Última atualização:** 21/10/2025
