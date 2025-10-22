# 🔑 Como Obter a Chave da OpenAI

## ℹ️ Informação Importante

**GPT-4o-mini e Whisper usam a MESMA chave!**

Você só precisa de **UMA** chave da OpenAI que funciona para:
- ✅ GPT-4o-mini (análise de texto)
- ✅ Whisper (transcrição de áudio)
- ✅ Todos os outros modelos da OpenAI

---

## 📝 Passo a Passo para Obter a Chave

### 1. Criar Conta na OpenAI

1. Acesse: https://platform.openai.com/signup
2. Crie uma conta (pode usar Google, Microsoft ou email)
3. Confirme seu email

### 2. Adicionar Método de Pagamento

⚠️ **IMPORTANTE:** A OpenAI exige um método de pagamento válido para usar a API

1. Acesse: https://platform.openai.com/account/billing/overview
2. Clique em **"Add payment method"**
3. Adicione um cartão de crédito
4. Configure um limite de gastos (recomendo começar com $5-10/mês)

### 3. Criar a API Key

1. Acesse: https://platform.openai.com/api-keys
2. Clique em **"+ Create new secret key"**
3. Dê um nome (ex: "InsightFlow Production")
4. **COPIE A CHAVE IMEDIATAMENTE** (ela só aparece uma vez!)
5. Guarde em local seguro

A chave terá este formato:
```
sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Configurar no Supabase

1. Acesse o Supabase Dashboard
2. Vá em **Edge Functions** → **process-video** → **Settings/Secrets**
3. Adicione:
   - **Nome:** `OPENAI_API_KEY`
   - **Valor:** Cole a chave que você copiou
4. Clique em **Save**

---

## 💰 Custos Estimados

### Preços da OpenAI (Pay-as-you-go):

| Serviço | Custo | Exemplo |
|---------|-------|---------|
| **GPT-4o-mini** | $0.150 / 1M tokens input<br>$0.600 / 1M tokens output | ~$0.01 por vídeo |
| **Whisper** | $0.006 / minuto | Vídeo de 5 min = $0.03 |

### Exemplo Real:
- **100 vídeos do Instagram por mês:**
  - GPT-4o-mini: ~$1.00
  - Whisper (média 3 min/vídeo): ~$1.80
  - **Total: ~$2.80/mês**

### Dicas para Economizar:
1. Configure um limite de gastos baixo inicialmente ($5-10)
2. A OpenAI te avisa quando atingir 75% e 100% do limite
3. Você pode monitorar o uso em: https://platform.openai.com/usage

---

## ✅ Verificar se Está Funcionando

### Teste 1: Verificar Créditos
1. Acesse: https://platform.openai.com/usage
2. Confirme que há saldo disponível

### Teste 2: Enviar um Vídeo
1. Use a extensão para enviar um vídeo do Instagram
2. Aguarde ~10 segundos
3. Verifique se o resumo é detalhado (não genérico)

### Teste 3: Verificar Logs
No Supabase Dashboard:
1. Edge Functions → process-video → Logs
2. Procure por mensagens como:
   - ✅ "Starting Whisper transcription"
   - ✅ "Transcription completed"
   - ✅ "Video processed successfully"

---

## 🚨 Troubleshooting

### Erro: "Insufficient credits"
- **Solução:** Adicione créditos em https://platform.openai.com/account/billing/overview

### Erro: "Invalid API key"
- **Solução:** Verifique se copiou a chave completa (começa com `sk-proj-`)

### Erro: "Rate limit exceeded"
- **Solução:** Aguarde alguns minutos ou aumente o limite da sua conta

### Resumos ainda genéricos?
- **Verifique:** Se a RAPIDAPI_KEY também está configurada no Supabase
- **Sem RapidAPI:** O Whisper não consegue transcrever (precisa do video_url)

---

## 🔐 Segurança

### ✅ Boas Práticas:
- ✅ Nunca compartilhe sua API key
- ✅ Não commite a chave no Git
- ✅ Use secrets do Supabase (não hardcode no código)
- ✅ Configure limites de gastos
- ✅ Monitore o uso regularmente

### ❌ Nunca Faça:
- ❌ Expor a chave no frontend
- ❌ Compartilhar em fóruns/Discord
- ❌ Deixar sem limite de gastos

---

## 📚 Links Úteis

- **Criar API Key:** https://platform.openai.com/api-keys
- **Gerenciar Billing:** https://platform.openai.com/account/billing/overview
- **Ver Uso:** https://platform.openai.com/usage
- **Documentação:** https://platform.openai.com/docs
- **Preços:** https://openai.com/api/pricing/

---

## 🎯 Próximos Passos

1. ✅ Criar conta na OpenAI
2. ✅ Adicionar método de pagamento
3. ✅ Criar API key
4. ✅ Configurar no Supabase (OPENAI_API_KEY)
5. ✅ Configurar RAPIDAPI_KEY também
6. ✅ Testar com um vídeo do Instagram

**Depois disso, seus vídeos terão análises completas e detalhadas!** 🚀
