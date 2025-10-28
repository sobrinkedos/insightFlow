# Deploy da Branch Staging no Vercel

## Status Atual

✅ Branch `staging` foi enviada para o GitHub
✅ Commit: `fix: adicionar funções de fila e documentação de troubleshooting`
✅ Variáveis de ambiente configuradas em `.env.vercel.preview`

## Configurar Vercel

### 1. Acessar Dashboard

Acesse: https://vercel.com/dashboard

### 2. Selecionar Projeto

Clique no projeto `insightFlow` (ou o nome que você deu)

### 3. Configurar Variáveis de Ambiente para Preview

1. Vá em **Settings** > **Environment Variables**
2. Para cada variável abaixo, clique em **Add New**
3. Selecione **Preview** (para branch staging)
4. Cole os valores:

```
VITE_SUPABASE_URL=https://bosxuteortfshfysoqrd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc3h1dGVvcnRmc2hmeXNvcXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0ODk4MzQsImV4cCI6MjA3NjA2NTgzNH0.-y6cd1ZIfqhtnr12Cf1Fx9guC_1EMtxfHKvwiGV4z2w
VITE_ENVIRONMENT=test
```

### 4. Verificar Deploy Automático

O Vercel deve ter detectado o push automaticamente e iniciado um deploy. Verifique em:

1. Vá na aba **Deployments**
2. Procure pelo deployment da branch `staging`
3. Clique para ver os logs

### 5. Acessar URL de Preview

Após o deploy, você terá uma URL como:
```
https://insight-flow-[hash]-[seu-usuario].vercel.app
```

## Configurar Branch Específica (Opcional)

Se quiser que a branch `staging` sempre faça deploy para um domínio específico:

1. Vá em **Settings** > **Git**
2. Em **Production Branch**, mantenha `main` ou `master`
3. A branch `staging` será automaticamente tratada como Preview

## Testar o Deploy

Após o deploy:

1. Acesse a URL de preview
2. Tente fazer login/cadastro
3. Tente adicionar um vídeo
4. Verifique se o processamento funciona

## Troubleshooting

### Deploy não iniciou automaticamente

1. Vá em **Settings** > **Git**
2. Verifique se o repositório está conectado
3. Force um novo deploy: **Deployments** > **Redeploy**

### Variáveis de ambiente não funcionam

1. Verifique se selecionou **Preview** ao adicionar
2. Após adicionar, faça um novo deploy (Redeploy)
3. As variáveis só são aplicadas em novos deploys

### Erro 404 nas rotas

O `vercel.json` já está configurado com rewrites para SPA. Se ainda houver erro:

1. Verifique se o `vercel.json` está no root do projeto
2. Force um novo deploy

## Próximos Passos

Após confirmar que o staging está funcionando:

1. Merge `staging` → `main` para produção
2. Configure variáveis de produção (`.env.vercel.production`)
3. Deploy automático para produção acontecerá
