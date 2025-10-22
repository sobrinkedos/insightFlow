# 🚀 Como Fazer Deploy da Edge Function

## Opção 1: Via Dashboard (Mais Fácil)

### Passo 1: Acesse o Dashboard
https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/functions/process-video

### Passo 2: Clique em "Edit function"

### Passo 3: Cole os arquivos

**Arquivo 1: index.ts**
- Abra: `supabase/functions/process-video/index.ts`
- Copie TODO o conteúdo
- Cole no editor do Dashboard

**Arquivo 2: ai-prompts.ts**
- Abra: `supabase/functions/process-video/ai-prompts.ts`
- Copie TODO o conteúdo
- Cole no editor do Dashboard (aba "ai-prompts.ts")

**Arquivo 3: instagram-api.ts**
- Abra: `supabase/functions/process-video/instagram-api.ts`
- Copie TODO o conteúdo
- Cole no editor do Dashboard (aba "instagram-api.ts")

### Passo 4: Clique em "Deploy"

### Passo 5: Aguarde o deploy (30-60 segundos)

---

## Opção 2: Via Script PowerShell

Execute no terminal:

```powershell
.\deploy-edge-function.ps1
```

Isso vai:
1. Abrir os arquivos no seu editor
2. Abrir o Dashboard do Supabase no navegador
3. Você só precisa copiar e colar!

---

## ✅ Como Saber se Funcionou

### Teste 1: Via Extensão
1. Abra um Reel do Instagram
2. Clique na extensão
3. Compartilhe o vídeo
4. Veja os logs no Supabase:
   ```
   ✅ Using video_url from extension
   ✅ Instagram video_url already in DB, skipping RapidAPI
   🎤 Attempting Whisper transcription...
   ```

### Teste 2: Via Botão Compartilhar
1. Copie um link do Instagram
2. Cole no app (botão "Compartilhar Vídeo")
3. Veja os logs no Supabase:
   ```
   📡 Instagram detected - no video_url in DB, fetching via RapidAPI...
   ✅ Got videoUrl from RapidAPI
   🎤 Attempting Whisper transcription...
   ```

---

## 🐛 Troubleshooting

### "Deploy failed"
- Verifique se copiou TODO o conteúdo dos 3 arquivos
- Verifique se não tem erros de sintaxe

### "Function timeout"
- Normal na primeira execução
- Tente novamente

### "RapidAPI error"
- Verifique se a chave da RapidAPI está configurada nos Secrets do Supabase
- Vá em: Settings → Edge Functions → Secrets
- Adicione: `RAPIDAPI_KEY` = `5b4ef30d7amsh604c58627ce5d90p18121bjsnbc0f5b169f67`

---

## 📊 Verificar Logs

Acesse: https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/functions/process-video/logs

Você deve ver:
- ✅ Logs de sucesso
- 📡 Chamadas à RapidAPI (quando necessário)
- 🎤 Transcrições do Whisper
- ✅ Vídeos processados
