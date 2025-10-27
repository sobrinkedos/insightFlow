# Task 2.3 - Configurar Variáveis de Ambiente no Vercel

## ✅ Checklist de Configuração

### Pré-requisitos
- [ ] Projeto conectado ao Vercel
- [ ] Arquivos `.env.vercel.*` criados localmente
- [ ] Acesso ao dashboard do Vercel

## Passo a Passo

### 1. Acessar Configurações do Vercel

1. Acesse https://vercel.com/dashboard
2. Selecione o projeto `insightFlow`
3. Vá em **Settings** > **Environment Variables**

### 2. Configurar Ambiente Development

1. Clique em **"Add New"**
2. Selecione **Environment**: `Development`
3. Adicione as seguintes variáveis:

```
Nome: NEXT_PUBLIC_SUPABASE_URL
Valor: https://enkpfnqsjjnanlqhjnsv.supabase.co
```

```
Nome: NEXT_PUBLIC_SUPABASE_ANON_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua3BmbnFzampuYW5scWhqbnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjcyODAsImV4cCI6MjA3NjE0MzI4MH0.WwYOmV_jXBsrZ74GWw9xuSzRC1vf1k39DAHjY1EI1hE
```

```
Nome: SUPABASE_SERVICE_ROLE_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua3BmbnFzampuYW5scWhqbnN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDU2NzI4MCwiZXhwIjoyMDc2MTQzMjgwfQ.RTUbPMwgLTEayzYN1DITFO1s-Mg_k0vQMb-9QSnF9z4
```

```
Nome: VITE_ENVIRONMENT
Valor: development
```

- [ ] Development configurado

### 3. Configurar Ambiente Preview

1. Clique em **"Add New"**
2. Selecione **Environment**: `Preview`
3. Adicione as seguintes variáveis:

```
Nome: NEXT_PUBLIC_SUPABASE_URL
Valor: https://bosxuteortfshfysoqrd.supabase.co
```

```
Nome: NEXT_PUBLIC_SUPABASE_ANON_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc3h1dGVvcnRmc2hmeXNvcXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0ODk4MzQsImV4cCI6MjA3NjA2NTgzNH0.-y6cd1ZIfqhtnr12Cf1Fx9guC_1EMtxfHKvwiGV4z2w
```

```
Nome: SUPABASE_SERVICE_ROLE_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc3h1dGVvcnRmc2hmeXNvcXJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ4OTgzNCwiZXhwIjoyMDc2MDY1ODM0fQ.3_6W5Ny2sHW_S38nLByoN53sHJM80XIgvKavr-zbNaU
```

```
Nome: VITE_ENVIRONMENT
Valor: test
```

- [ ] Preview configurado

### 4. Configurar Ambiente Production

1. Clique em **"Add New"**
2. Selecione **Environment**: `Production`
3. Adicione as seguintes variáveis:

```
Nome: NEXT_PUBLIC_SUPABASE_URL
Valor: https://jropngieefxgnufmkeaj.supabase.co
```

```
Nome: NEXT_PUBLIC_SUPABASE_ANON_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyb3BuZ2llZWZ4Z251Zm1rZWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjkyNzAsImV4cCI6MjA3NzEwNTI3MH0.7dFi7kNVRxOla1HycbRZwWvhDfgFQuZoyz_kJBaxF4E
```

```
Nome: SUPABASE_SERVICE_ROLE_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyb3BuZ2llZWZ4Z251Zm1rZWFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTUyOTI3MCwiZXhwIjoyMDc3MTA1MjcwfQ.rK2Mj6vJQQtTOKlo6vVJ635IbK9BPudR9MFMUG2O8iM
```

```
Nome: VITE_ENVIRONMENT
Valor: production
```

- [ ] Production configurado

## Verificação

### Testar Localmente

```bash
# Verificar configuração local
npm run verify-env

# Deve exibir:
# ✅ Configuração carregada com sucesso!
```

### Testar no Vercel

1. **Development:**
```bash
git checkout development
git commit --allow-empty -m "test: verificar env vars"
git push origin development
```
Verifique os logs do deploy no Vercel

2. **Preview:**
```bash
git checkout staging
git commit --allow-empty -m "test: verificar env vars"
git push origin staging
```
Verifique os logs do deploy no Vercel

3. **Production:**
```bash
git checkout main
git commit --allow-empty -m "test: verificar env vars"
git push origin main
```
Aguarde aprovação e verifique os logs

## Troubleshooting

### Variáveis não aparecem no build
- Certifique-se de selecionar o ambiente correto
- Variáveis `NEXT_PUBLIC_*` são expostas no frontend
- Outras variáveis são apenas server-side
- Faça um novo deploy após adicionar variáveis

### Erro "Invalid API key"
- Verifique se copiou a chave completa (são muito longas)
- Confirme que não há espaços extras
- Verifique se está usando a chave do ambiente correto

### Deploy falha com erro de configuração
- Execute `npm run verify-env` localmente
- Verifique os logs de build no Vercel
- Confirme que todas as 4 variáveis foram adicionadas

## Próximos Passos

Após configurar todas as variáveis:
- [ ] Testar deploy em cada ambiente
- [ ] Verificar conectividade com Supabase
- [ ] Atualizar documentação com URLs de deploy
- [ ] Prosseguir para Task 3 (Sistema de Migração)

## Referências

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Documentação do Gerenciador](../config/README.md)
- [Guia de Importação](./IMPORTAR-ENV-VERCEL.md)
