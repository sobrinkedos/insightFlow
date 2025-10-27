# Setup Rápido do Vercel

## ⚡ Guia de 5 Minutos

### 1. Criar Conta e Projeto (2 min)

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em **"Add New..."** → **"Project"**
3. Selecione `sobrinkedos/insightFlow`
4. **NÃO CLIQUE EM DEPLOY AINDA!**

### 2. Obter Tokens (1 min)

```bash
# Token de acesso
# Acesse: https://vercel.com/account/tokens
# Crie token: "GitHub Actions Deploy"
# Copie: VERCEL_TOKEN

# IDs do projeto
# Acesse: Settings → General
# Copie: VERCEL_ORG_ID e VERCEL_PROJECT_ID
```

### 3. Configurar GitHub Secrets (1 min)

No GitHub, vá em **Settings** → **Secrets** → **Actions**:

```
VERCEL_TOKEN=seu_token
VERCEL_ORG_ID=seu_org_id
VERCEL_PROJECT_ID=seu_project_id

# Também adicione (se ainda não tiver):
PROD_SUPABASE_URL=https://jropngieefxgnufmkeaj.supabase.co
PROD_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Configurar Variáveis no Vercel (1 min)

No Vercel, vá em **Settings** → **Environment Variables**:

#### Para Production:
```bash
VITE_SUPABASE_URL=https://jropngieefxgnufmkeaj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ENVIRONMENT=production
```

#### Para Preview (development):
```bash
VITE_SUPABASE_URL=https://enkpfnqsjjnanlqhjnsv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ENVIRONMENT=development
```

#### Para Preview (staging):
```bash
VITE_SUPABASE_URL=https://bosxuteortfshfysoqrd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ENVIRONMENT=test
```

### 5. Configurar Branches

No Vercel, vá em **Settings** → **Git**:

1. **Production Branch:** `main`
2. **Desabilitar** auto-deploy para main (usaremos GitHub Actions)
3. Em **Branch Deployments**, adicione:
   - `development` (auto-deploy ✅)
   - `staging` (auto-deploy ✅)

## ✅ Pronto!

Agora você pode:

```bash
# Deploy automático em dev
git push origin development

# Deploy automático em staging
git push origin staging

# Deploy manual em produção (requer aprovação)
git push origin main
```

## 🔍 Verificar

1. Acesse o dashboard do Vercel
2. Veja os deployments em **Deployments**
3. Teste as URLs geradas

## 📚 Documentação Completa

Para mais detalhes, veja:
- [DEPLOY-VERCEL.md](./DEPLOY-VERCEL.md) - Guia completo
- [CONFIGURAR-VERCEL.md](./CONFIGURAR-VERCEL.md) - Configuração detalhada

## 🆘 Problemas?

### Build falha
```bash
# Teste localmente
npm run build
```

### Variáveis não carregam
- Verifique prefixo `VITE_`
- Redeploy após adicionar variáveis

### 404 em rotas
- Arquivo `vercel.json` já está configurado
- Redeploy se necessário

---

**Tempo total:** ~5 minutos ⚡
