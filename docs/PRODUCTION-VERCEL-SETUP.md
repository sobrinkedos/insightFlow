# Deploy de Produção no Vercel

## Status Atual

✅ Branch `main` atualizada com código da `development`
✅ Push feito para o GitHub
✅ Variáveis de ambiente configuradas em `.env.vercel.production`

## Configuração Temporária

**Estamos usando o projeto Development (`enkpfnqsjjnanlqhjnsv`) para produção temporariamente** porque:
- Está 100% funcional
- Tem todas as Edge Functions deployadas
- Tem todas as migrações aplicadas
- Processamento de vídeos funcionando perfeitamente

## Configurar Vercel para Produção

### 1. Acessar Dashboard

Acesse: https://vercel.com/dashboard

### 2. Selecionar Projeto

Clique no projeto `insightFlow`

### 3. Configurar Variáveis de Ambiente para Production

1. Vá em **Settings** > **Environment Variables**
2. Para cada variável abaixo, clique em **Add New**
3. Selecione **Production** (para branch main)
4. Cole os valores:

```
VITE_SUPABASE_URL=https://enkpfnqsjjnanlqhjnsv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua3BmbnFzampuYW5scWhqbnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjcyODAsImV4cCI6MjA3NjE0MzI4MH0.WwYOmV_jXBsrZ74GWw9xuSzRC1vf1k39DAHjY1EI1hE
VITE_ENVIRONMENT=production
```

### 4. Verificar Deploy Automático

O Vercel deve ter detectado o push automaticamente e iniciado um deploy. Verifique em:

1. Vá na aba **Deployments**
2. Procure pelo deployment da branch `main`
3. Clique para ver os logs

### 5. Acessar URL de Produção

Após o deploy, você terá uma URL de produção como:
```
https://insight-flow.vercel.app
```

Ou o domínio customizado que você configurou.

## Estrutura Atual

```
Development (enkpfnqsjjnanlqhjnsv) - Projeto Supabase
├── Branch: development → Vercel Development
├── Branch: staging → Vercel Preview  
└── Branch: main → Vercel Production

Test (bosxuteortfshfysoqrd) - Pausado
└── Com problemas nas Edge Functions

Production (jropngieefxgnufmkeaj) - Não configurado
└── Para migração futura
```

## Testar o Deploy

Após o deploy:

1. ✅ Acesse a URL de produção
2. ✅ Faça login/cadastro
3. ✅ Adicione um vídeo do YouTube
4. ✅ Verifique se o processamento funciona
5. ✅ Teste todas as funcionalidades principais

## Monitoramento

### Logs do Supabase
- https://supabase.com/dashboard/project/enkpfnqsjjnanlqhjnsv/logs/edge-functions

### Logs do Vercel
- https://vercel.com/dashboard > Seu Projeto > Deployments > Logs

## Próximos Passos (Futuro)

Quando houver necessidade de separar produção:

1. Configurar projeto Production dedicado (`jropngieefxgnufmkeaj`)
2. Aplicar todas as migrações do Development
3. Copiar Edge Functions
4. Configurar secrets
5. Atualizar variáveis do Vercel
6. Fazer deploy

## Troubleshooting

### Deploy não iniciou automaticamente

1. Vá em **Settings** > **Git**
2. Verifique se o repositório está conectado
3. Verifique se a branch `main` está configurada como Production Branch
4. Force um novo deploy: **Deployments** > **Redeploy**

### Variáveis de ambiente não funcionam

1. Verifique se selecionou **Production** ao adicionar
2. Após adicionar, faça um novo deploy (Redeploy)
3. As variáveis só são aplicadas em novos deploys

### Erro 404 nas rotas

O `vercel.json` já está configurado com rewrites para SPA. Se ainda houver erro:

1. Verifique se o `vercel.json` está no root do projeto
2. Force um novo deploy

## Domínio Customizado (Opcional)

Para adicionar um domínio customizado:

1. Vá em **Settings** > **Domains**
2. Clique em **Add Domain**
3. Siga as instruções para configurar DNS
