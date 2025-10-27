# Como Importar Variáveis de Ambiente no Vercel

## Arquivos Criados

Foram criados 3 arquivos com as variáveis de ambiente para cada ambiente:

- `.env.vercel.development` - Variáveis para Development
- `.env.vercel.preview` - Variáveis para Preview (Staging)
- `.env.vercel.production` - Variáveis para Production

⚠️ **IMPORTANTE:** Estes arquivos contêm credenciais sensíveis e estão no `.gitignore`. Não devem ser commitados no Git!

## Método 1: Importação via Interface Web (Recomendado)

### Passo 1: Acessar Configurações
1. Acesse https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** > **Environment Variables**

### Passo 2: Importar para Development
1. Clique em **"Add New"** ou **"Import .env"**
2. Selecione o ambiente: **Development**
3. Copie todo o conteúdo de `.env.vercel.development`
4. Cole no campo de texto
5. Clique em **"Add"** ou **"Import"**

### Passo 3: Importar para Preview
1. Clique em **"Add New"** ou **"Import .env"**
2. Selecione o ambiente: **Preview**
3. Copie todo o conteúdo de `.env.vercel.preview`
4. Cole no campo de texto
5. Clique em **"Add"** ou **"Import"**

### Passo 4: Importar para Production
1. Clique em **"Add New"** ou **"Import .env"**
2. Selecione o ambiente: **Production**
3. Copie todo o conteúdo de `.env.vercel.production`
4. Cole no campo de texto
5. Clique em **"Add"** ou **"Import"**

## Método 2: Via Vercel CLI

### Pré-requisitos
```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Vincular projeto
vercel link
```

### Importar Variáveis

```bash
# Development
vercel env add NEXT_PUBLIC_SUPABASE_URL development < .env.vercel.development
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development < .env.vercel.development
vercel env add SUPABASE_SERVICE_ROLE_KEY development < .env.vercel.development
vercel env add VITE_ENVIRONMENT development < .env.vercel.development

# Preview
vercel env add NEXT_PUBLIC_SUPABASE_URL preview < .env.vercel.preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview < .env.vercel.preview
vercel env add SUPABASE_SERVICE_ROLE_KEY preview < .env.vercel.preview
vercel env add VITE_ENVIRONMENT preview < .env.vercel.preview

# Production
vercel env add NEXT_PUBLIC_SUPABASE_URL production < .env.vercel.production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production < .env.vercel.production
vercel env add SUPABASE_SERVICE_ROLE_KEY production < .env.vercel.production
vercel env add VITE_ENVIRONMENT production < .env.vercel.production
```

## Método 3: Copiar e Colar Manual

Se preferir adicionar uma por uma:

### Development
```
NEXT_PUBLIC_SUPABASE_URL=https://enkpfnqsjjnanlqhjnsv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua3BmbnFzampuYW5scWhqbnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjcyODAsImV4cCI6MjA3NjE0MzI4MH0.WwYOmV_jXBsrZ74GWw9xuSzRC1vf1k39DAHjY1EI1hE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua3BmbnFzampuYW5scWhqbnN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDU2NzI4MCwiZXhwIjoyMDc2MTQzMjgwfQ.RTUbPMwgLTEayzYN1DITFO1s-Mg_k0vQMb-9QSnF9z4
VITE_ENVIRONMENT=development
```

### Preview (Staging)
```
NEXT_PUBLIC_SUPABASE_URL=https://bosxuteortfshfysoqrd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc3h1dGVvcnRmc2hmeXNvcXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0ODk4MzQsImV4cCI6MjA3NjA2NTgzNH0.-y6cd1ZIfqhtnr12Cf1Fx9guC_1EMtxfHKvwiGV4z2w
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc3h1dGVvcnRmc2hmeXNvcXJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ4OTgzNCwiZXhwIjoyMDc2MDY1ODM0fQ.3_6W5Ny2sHW_S38nLByoN53sHJM80XIgvKavr-zbNaU
VITE_ENVIRONMENT=test
```

### Production
```
NEXT_PUBLIC_SUPABASE_URL=https://jropngieefxgnufmkeaj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyb3BuZ2llZWZ4Z251Zm1rZWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjkyNzAsImV4cCI6MjA3NzEwNTI3MH0.7dFi7kNVRxOla1HycbRZwWvhDfgFQuZoyz_kJBaxF4E
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyb3BuZ2llZWZ4Z251Zm1rZWFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTUyOTI3MCwiZXhwIjoyMDc3MTA1MjcwfQ.rK2Mj6vJQQtTOKlo6vVJ635IbK9BPudR9MFMUG2O8iM
VITE_ENVIRONMENT=production
```

## Verificação

Após importar, verifique se todas as variáveis foram adicionadas:

### Checklist
- [ ] Development: 4 variáveis adicionadas
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] VITE_ENVIRONMENT

- [ ] Preview: 4 variáveis adicionadas
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] VITE_ENVIRONMENT

- [ ] Production: 4 variáveis adicionadas
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] VITE_ENVIRONMENT

## Testar Configuração

Após importar, faça um deploy de teste:

```bash
# Testar Development
git checkout development
git commit --allow-empty -m "test: verificar env vars"
git push origin development

# Testar Preview
git checkout staging
git commit --allow-empty -m "test: verificar env vars"
git push origin staging

# Testar Production
git checkout main
git commit --allow-empty -m "test: verificar env vars"
git push origin main
```

Verifique nos logs do Vercel se as variáveis foram carregadas corretamente.

## Troubleshooting

### Variáveis não aparecem no build
- Certifique-se de que selecionou o ambiente correto (Development/Preview/Production)
- Variáveis que começam com `NEXT_PUBLIC_` são expostas no frontend
- Outras variáveis são apenas para server-side

### Erro de autenticação Supabase
- Verifique se copiou as chaves completas (são muito longas)
- Verifique se não há espaços extras no início ou fim
- Confirme que está usando as credenciais do ambiente correto

### Deploy não usa as novas variáveis
- Faça um novo deploy após adicionar variáveis
- Ou force um redeploy no Vercel Dashboard

## Segurança

⚠️ **NUNCA:**
- Commite os arquivos `.env.vercel.*` no Git
- Compartilhe as credenciais publicamente
- Use credenciais de produção em desenvolvimento

✅ **SEMPRE:**
- Mantenha os arquivos `.env.vercel.*` localmente
- Use `.gitignore` para proteger credenciais
- Rotacione credenciais periodicamente

## Próximos Passos

Após importar as variáveis:
1. Testar deploys em cada ambiente
2. Verificar conectividade com Supabase
3. Configurar GitHub Actions para backup
4. Documentar URLs de deploy

## Referências

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Supabase Documentation](https://supabase.com/docs)
