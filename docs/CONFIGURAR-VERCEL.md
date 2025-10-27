# Guia de Configuração do Vercel

## Pré-requisitos
- Conta no Vercel (https://vercel.com)
- Repositório GitHub conectado
- Credenciais dos ambientes Supabase (ver `INFRAESTRUTURA.md`)

## Passo 1: Conectar Repositório

1. Acesse https://vercel.com/dashboard
2. Clique em "Add New Project"
3. Selecione o repositório `sobrinkedos/insightFlow`
4. Clique em "Import"

## Passo 2: Configurar Projeto

### Configurações Gerais
- **Framework Preset:** Vite
- **Root Directory:** `./`
- **Build Command:** `npm run build:no-check`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Passo 3: Configurar Ambientes

### Production Environment (Branch: main)

1. Vá em "Settings" > "Environment Variables"
2. Selecione "Production" no dropdown
3. Adicione as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=https://jropngieefxgnufmkeaj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyb3BuZ2llZWZ4Z251Zm1rZWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjkyNzAsImV4cCI6MjA3NzEwNTI3MH0.7dFi7kNVRxOla1HycbRZwWvhDfgFQuZoyz_kJBaxF4E
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyb3BuZ2llZWZ4Z251Zm1rZWFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTUyOTI3MCwiZXhwIjoyMDc3MTA1MjcwfQ.rK2Mj6vJQQtTOKlo6vVJ635IbK9BPudR9MFMUG2O8iM
VITE_ENVIRONMENT=production
```

### Preview Environment (Branch: staging)

1. Selecione "Preview" no dropdown
2. Adicione as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=https://bosxuteortfshfysoqrd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc3h1dGVvcnRmc2hmeXNvcXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0ODk4MzQsImV4cCI6MjA3NjA2NTgzNH0.-y6cd1ZIfqhtnr12Cf1Fx9guC_1EMtxfHKvwiGV4z2w
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc3h1dGVvcnRmc2hmeXNvcXJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ4OTgzNCwiZXhwIjoyMDc2MDY1ODM0fQ.3_6W5Ny2sHW_S38nLByoN53sHJM80XIgvKavr-zbNaU
VITE_ENVIRONMENT=test
```

### Development Environment (Branch: development)

1. Selecione "Development" no dropdown
2. Adicione as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=https://enkpfnqsjjnanlqhjnsv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua3BmbnFzampuYW5scWhqbnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjcyODAsImV4cCI6MjA3NjE0MzI4MH0.WwYOmV_jXBsrZ74GWw9xuSzRC1vf1k39DAHjY1EI1hE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua3BmbnFzampuYW5scWhqbnN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDU2NzI4MCwiZXhwIjoyMDc2MTQzMjgwfQ.RTUbPMwgLTEayzYN1DITFO1s-Mg_k0vQMb-9QSnF9z4
VITE_ENVIRONMENT=development
```

## Passo 4: Configurar Git Integration

1. Vá em "Settings" > "Git"
2. Configure:
   - **Production Branch:** `main`
   - **Preview Branches:** Selecione `staging` e `development`
   - **Automatic Deployments:** Ativado para todas as branches

## Passo 5: Configurar Proteção de Deploy em Produção

1. Vá em "Settings" > "Deployment Protection"
2. Ative "Deployment Protection" para Production
3. Configure aprovadores autorizados

## Passo 6: Testar Deploys

### Testar Development
```bash
git checkout development
git commit --allow-empty -m "test: trigger deploy"
git push origin development
```
Verifique o deploy em: Vercel Dashboard > Deployments

### Testar Staging
```bash
git checkout staging
git commit --allow-empty -m "test: trigger deploy"
git push origin staging
```
Verifique o deploy em: Vercel Dashboard > Deployments

### Testar Production
```bash
git checkout main
git commit --allow-empty -m "test: trigger deploy"
git push origin main
```
Aguarde aprovação e verifique o deploy

## Passo 7: Configurar Domínios (Opcional)

### Production
1. Vá em "Settings" > "Domains"
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções

### Preview Environments
- Vercel gera automaticamente URLs para preview
- Formato: `projeto-branch-hash.vercel.app`

## Verificação Final

### Checklist
- [ ] Projeto conectado ao GitHub
- [ ] Variáveis de ambiente configuradas para Production
- [ ] Variáveis de ambiente configuradas para Preview
- [ ] Variáveis de ambiente configuradas para Development
- [ ] Git integration configurada
- [ ] Deploy automático testado em development
- [ ] Deploy automático testado em staging
- [ ] Deploy com aprovação testado em main
- [ ] URLs de deploy documentadas

### URLs de Deploy
Após configuração, documente aqui as URLs:

- **Production:** [URL aqui]
- **Staging:** [URL aqui]
- **Development:** [URL aqui]

## Troubleshooting

### Deploy falha com erro de build
- Verifique se todas as variáveis de ambiente estão configuradas
- Verifique os logs de build no Vercel Dashboard
- Teste o build localmente: `npm run build:no-check`

### Variáveis de ambiente não carregam
- Verifique se selecionou o ambiente correto (Production/Preview/Development)
- Verifique se as variáveis começam com `NEXT_PUBLIC_` para serem expostas no frontend
- Faça redeploy após adicionar variáveis

### Deploy não é acionado automaticamente
- Verifique se Git integration está ativada
- Verifique se a branch está configurada corretamente
- Verifique webhooks no GitHub: Settings > Webhooks

## Próximos Passos

Após configurar o Vercel:
1. Atualizar `docs/INFRAESTRUTURA.md` com URLs de deploy
2. Atualizar `docs/GUIA-RAPIDO-AMBIENTES.md` com URLs de acesso
3. Testar fluxo completo de deploy
4. Configurar GitHub Actions para backup (Task 4)

## Referências

- [Vercel Documentation](https://vercel.com/docs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Git Integration](https://vercel.com/docs/concepts/git)
