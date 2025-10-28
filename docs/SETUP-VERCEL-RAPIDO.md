# Setup Rápido do Vercel

## ⚡ Guia de 5 Minutos

### 1. Criar Conta e Projeto (2 min)

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em **"Add New..."** → **"Project"**
3. Selecione `sobrinkedos/insightFlow`
4. **NÃO CLIQUE EM DEPLOY AINDA!**

### 2. Obter Tokens e IDs (1 min)

#### A. Token de Acesso (VERCEL_TOKEN)

1. Acesse: https://vercel.com/account/tokens
2. Clique em **Create Token**
3. Nome: "GitHub Actions Deploy"
4. Scope: **Full Account**
5. Copie o token (só aparece uma vez!)

#### B. Organization ID (VERCEL_ORG_ID)

1. No dashboard, clique no seu **avatar/nome** (canto superior direito)
2. Vá em **Settings**
3. Na barra lateral, clique em **General**
4. Procure por **Team ID** ou **Your ID**
5. Copie o ID (formato: `team_xxxxx` ou `user_xxxxx`)

#### C. Project ID (VERCEL_PROJECT_ID)

1. No dashboard do **seu projeto**, clique em **Settings** (barra lateral)
2. Na aba **General** (já deve estar selecionada)
3. Role a página até encontrar **Project ID**
4. Copie o ID (formato: `prj_xxxxx`)

**Dica:** Se não encontrar o Project ID, você pode usar a Vercel CLI:

```bash
npm install -g vercel
vercel login
vercel link
# Isso cria .vercel/project.json com os IDs
cat .vercel/project.json
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

**IMPORTANTE:** A Vercel mudou a interface. Siga estes passos atualizados:

1. **No dashboard do projeto**, clique em **Settings** (barra lateral esquerda)

2. **Na seção Git**, você verá:
   - **Connected Git Repository** - seu repositório GitHub
   - **Production Branch** - por padrão é `main`

3. **Para configurar auto-deploy por branch:**
   - Role a página até encontrar **Deploy Hooks** ou **Ignored Build Step**
   - OU vá para a aba **Deployments** no menu superior
   - A Vercel automaticamente faz deploy de TODAS as branches por padrão

4. **Configuração recomendada:**
   - Deixe o auto-deploy ativo para `development` e `staging`
   - Para `main` (produção), você pode:
     - **Opção A:** Desabilitar auto-deploy e usar GitHub Actions (mais
       controle)
     - **Opção B:** Manter auto-deploy mas adicionar proteção de branch no
       GitHub

5. **Para desabilitar auto-deploy em produção (Opção A):**
   - Vá em **Settings** → **Git**
   - Role até **Ignored Build Step**
   - Adicione um script que cancela build na branch main:
   ```bash
   if [ "$VERCEL_GIT_COMMIT_REF" = "main" ]; then exit 0; else exit 1; fi
   ```

**Nota:** A interface da Vercel é dinâmica. Se não encontrar essas opções
exatas, o auto-deploy por branch funciona automaticamente - cada push em
qualquer branch cria um preview deployment.

---

## 🎯 Configuração Simplificada (Recomendada)

**Se você não encontrou as opções do passo 5, não se preocupe!** A Vercel
funciona assim por padrão:

### Como Funciona Automaticamente:

1. **Branch `main`** → Deploy de **Produção**
   - URL: `https://seu-projeto.vercel.app`
   - Cada push faz deploy automático

2. **Outras branches** (`development`, `staging`) → **Preview Deployments**
   - URL única para cada branch
   - Exemplo: `https://seu-projeto-git-development-user.vercel.app`
   - Cada push atualiza o preview

3. **Pull Requests** → Preview automático
   - Cada PR gera um preview deployment
   - URL comentada automaticamente no PR

### O Que Você Precisa Fazer:

✅ **Apenas configure as variáveis de ambiente no passo 4**

- Selecione o ambiente correto para cada variável:
  - `Production` → variáveis de produção
  - `Preview` → variáveis de development/staging

✅ **Pronto!** A Vercel cuida do resto automaticamente.

### Onde Ver os Deployments:

1. No dashboard do projeto, clique na aba **Deployments** (menu superior)
2. Você verá:
   - 🟢 **Production** - deploys da branch main
   - 🔵 **Preview** - deploys de outras branches
3. Clique em qualquer deployment para ver a URL e logs

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

- **[VERCEL-ONDE-ENCONTRAR-IDS.md](./VERCEL-ONDE-ENCONTRAR-IDS.md)** - 🔍 Guia
  visual detalhado para encontrar os IDs
- [CONFIGURAR-VERCEL.md](./CONFIGURAR-VERCEL.md) - Configuração detalhada
- [IMPORTAR-ENV-VERCEL.md](./IMPORTAR-ENV-VERCEL.md) - Importar variáveis de
  ambiente

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
