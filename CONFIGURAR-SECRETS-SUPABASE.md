# 🔐 Configurar Secrets no Supabase

## Problema Identificado

Os vídeos do Instagram estão sendo processados, mas a IA está gerando resumos genéricos porque:

1. ✅ A Edge Function está funcionando
2. ✅ Os vídeos são marcados como "Concluído"
3. ❌ **A RapidAPI não está extraindo o video_url porque a chave não está configurada no Supabase**

## Solução: Configurar Secrets no Dashboard

### Passo 1: Acessar Edge Functions Secrets

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto: **insightFlow**
3. No menu lateral, clique em **Edge Functions**
4. Clique na função **process-video**
5. Vá na aba **Settings** ou **Secrets**

### Passo 2: Adicionar as Secrets

Configure as seguintes variáveis de ambiente (secrets):

#### 1. OPENAI_API_KEY (Obrigatória)
```
Nome: OPENAI_API_KEY
Valor: [Sua chave da OpenAI]
```
**Onde conseguir:** https://platform.openai.com/api-keys

#### 2. RAPIDAPI_KEY (Recomendada para Instagram)
```
Nome: RAPIDAPI_KEY
Valor: 5b4ef30d7amsh604c58627ce5d90p18121bjsnbc0f5b169f67
```
**Onde conseguir:** https://rapidapi.com/hub

#### 3. YOUTUBE_API_KEY (Opcional para YouTube)
```
Nome: YOUTUBE_API_KEY
Valor: [Sua chave do YouTube Data API v3]
```
**Onde conseguir:** https://console.cloud.google.com/apis/credentials

### Passo 3: Salvar e Testar

1. Clique em **Save** ou **Add Secret**
2. A Edge Function será reiniciada automaticamente
3. Teste enviando um novo vídeo do Instagram

## Como Testar se Funcionou

Após configurar as secrets, envie um vídeo do Instagram e verifique:

1. O vídeo deve ter um resumo mais detalhado (não genérico)
2. A categoria deve ser mais específica (não apenas "Redes Sociais")
3. O campo `video_url` deve estar preenchido no banco de dados

### Verificar no Banco de Dados

Execute esta query no SQL Editor do Supabase:

```sql
SELECT 
  id,
  url,
  status,
  title,
  summary_short,
  category,
  video_url,
  thumbnail_url,
  created_at
FROM videos 
ORDER BY created_at DESC 
LIMIT 5;
```

Se `video_url` estiver preenchido, significa que a RapidAPI está funcionando! 🎉

## Fluxo Completo de Processamento

Com as secrets configuradas:

1. **Extensão** → Detecta vídeo do Instagram e envia URL
2. **RapidAPI** → Extrai `video_url` e `thumbnail_url`
3. **Whisper API** → Transcreve o áudio do vídeo (se < 25MB)
4. **GPT-4o-mini** → Analisa a transcrição e gera resumo detalhado
5. **Banco de Dados** → Salva todas as informações

## Troubleshooting

### Se ainda não funcionar:

1. **Verifique os logs da Edge Function:**
   - Dashboard → Edge Functions → process-video → Logs
   - Procure por mensagens como "RAPIDAPI_KEY configured: true"

2. **Teste a RapidAPI manualmente:**
   - Acesse: https://rapidapi.com/hub
   - Teste o endpoint com um vídeo do Instagram

3. **Verifique se a chave da OpenAI tem créditos:**
   - Acesse: https://platform.openai.com/usage
   - Confirme que há saldo disponível

## Custos Estimados

- **OpenAI GPT-4o-mini:** ~$0.01 por vídeo
- **OpenAI Whisper:** ~$0.006 por minuto de áudio
- **RapidAPI Instagram:** Varia por plano (geralmente gratuito até 100 requests/mês)

---

**Próximo passo:** Configure as secrets no dashboard e teste novamente! 🚀
