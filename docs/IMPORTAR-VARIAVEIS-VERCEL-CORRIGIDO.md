# 📋 Guia: Importar Variáveis Corretas na Vercel

## ✅ Arquivos Corrigidos

Os arquivos `.env.vercel.*` foram corrigidos de `NEXT_PUBLIC_*` para `VITE_*`.

## 🎯 Como Importar na Vercel

### Opção 1: Adicionar Manualmente (Recomendado)

#### Para Branch Development (Preview):

1. Vá em: **Settings → Environment Variables**
2. Clique em **Add New**
3. Adicione cada variável:

```bash
# Variável 1
Name: VITE_SUPABASE_URL
Value: https://enkpfnqsjjnanlqhjnsv.supabase.co
Environments: ☑️ Preview

# Variável 2
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua3BmbnFzampuYW5scWhqbnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjcyODAsImV4cCI6MjA3NjE0MzI4MH0.WwYOmV_jXBsrZ74GWw9xuSzRC1vf1k39DAHjY1EI1hE
Environments: ☑️ Preview

# Variável 3
Name: VITE_ENVIRONMENT
Value: development
Environments: ☑️ Preview
```

#### Para Branch Staging (Preview):

```bash
# Variável 1
Name: VITE_SUPABASE_URL
Value: https://bosxuteortfshfysoqrd.supabase.co
Environments: ☑️ Preview

# Variável 2
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc3h1dGVvcnRmc2hmeXNvcXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0ODk4MzQsImV4cCI6MjA3NjA2NTgzNH0.-y6cd1ZIfqhtnr12Cf1Fx9guC_1EMtxfHKvwiGV4z2w
Environments: ☑️ Preview

# Variável 3
Name: VITE_ENVIRONMENT
Value: test
Environments: ☑️ Preview
```

#### Para Branch Main (Production):

```bash
# Variável 1
Name: VITE_SUPABASE_URL
Value: https://jropngieefxgnufmkeaj.supabase.co
Environments: ☑️ Production

# Variável 2
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyb3BuZ2llZWZ4Z251Zm1rZWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjkyNzAsImV4cCI6MjA3NzEwNTI3MH0.7dFi7kNVRxOla1HycbRZwWvhDfgFQuZoyz_kJBaxF4E
Environments: ☑️ Production

# Variável 3
Name: VITE_ENVIRONMENT
Value: production
Environments: ☑️ Production
```

---

### Opção 2: Via Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Linkar projeto
vercel link

# Importar variáveis de development (Preview)
vercel env pull .env.vercel.development

# Importar variáveis de staging (Preview)
vercel env pull .env.vercel.preview

# Importar variáveis de production
vercel env pull .env.vercel.production
```

---

## ⚠️ IMPORTANTE: Remover Variáveis Antigas

Antes de adicionar as novas, **remova as variáveis antigas** com prefixo
`NEXT_PUBLIC_*`:

1. Vá em: **Settings → Environment Variables**
2. Procure por variáveis que começam com `NEXT_PUBLIC_`
3. Clique nos 3 pontos → **Delete**
4. Confirme a exclusão

Variáveis para remover:

- ❌ `NEXT_PUBLIC_SUPABASE_URL`
- ❌ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🔍 Como Diferenciar Ambientes na Vercel

A Vercel usa o conceito de **Environments** para diferenciar:

### Preview (Branches development e staging)

- Usado para todas as branches que NÃO são a production branch
- Inclui: `development`, `staging`, feature branches, etc.
- **Importante:** Você pode ter MÚLTIPLAS configurações de Preview
  - Uma para `development` (Supabase Dev)
  - Outra para `staging` (Supabase Test)

### Production (Branch main)

- Usado APENAS para a branch configurada como production (geralmente `main`)
- Deploy de produção

---

## 🎯 Configuração Recomendada

Para ter ambientes diferentes por branch, você tem 2 opções:

### Opção A: Usar VITE_ENVIRONMENT para diferenciar

Adicione todas as variáveis como **Preview** e use `VITE_ENVIRONMENT` para
determinar qual Supabase usar no código:

```typescript
// config/environment.config.ts
const configs = {
  development: {
    supabaseUrl: "https://enkpfnqsjjnanlqhjnsv.supabase.co",
    // ...
  },
  test: {
    supabaseUrl: "https://bosxuteortfshfysoqrd.supabase.co",
    // ...
  },
  production: {
    supabaseUrl: "https://jropngieefxgnufmkeaj.supabase.co",
    // ...
  },
};

const env = import.meta.env.VITE_ENVIRONMENT || "development";
export const config = configs[env];
```

### Opção B: Configurar por Branch Específica (Mais Complexo)

Na Vercel, você pode configurar variáveis para branches específicas:

1. Ao adicionar variável, clique em **Preview**
2. Clique em **Select a custom Preview branch**
3. Digite o nome da branch (ex: `development`)
4. Adicione as variáveis específicas para essa branch

Repita para cada branch.

---

## ✅ Checklist Final

Depois de configurar:

- [ ] Removi todas as variáveis `NEXT_PUBLIC_*`
- [ ] Adicionei `VITE_SUPABASE_URL` para Preview
- [ ] Adicionei `VITE_SUPABASE_ANON_KEY` para Preview
- [ ] Adicionei `VITE_ENVIRONMENT` para Preview
- [ ] Adicionei as mesmas variáveis para Production (com valores de prod)
- [ ] Fiz **Redeploy** do último deployment que falhou

---

## 🚀 Após Configurar

1. Vá em **Deployments**
2. Encontre o deployment que falhou
3. Clique nos 3 pontos → **Redeploy**
4. Aguarde o build completar
5. Verifique os logs para confirmar sucesso

---

**Última atualização:** 2025-01-28
