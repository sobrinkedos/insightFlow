# Configurar GitHub Environment para Produção

## 📋 Visão Geral

O GitHub Environment permite configurar aprovações manuais e proteções para deploys em produção.

## 🔧 Configuração

### Passo 1: Criar Environment

1. **Acesse o Repositório**
   - Vá para `https://github.com/sobrinkedos/insightFlow`

2. **Abra Settings**
   - Clique em **Settings** (ícone de engrenagem)

3. **Acesse Environments**
   - No menu lateral, clique em **Environments**

4. **Criar Novo Environment**
   - Clique em **New environment**
   - Nome: `production`
   - Clique em **Configure environment**

### Passo 2: Configurar Proteções

#### Aprovadores Obrigatórios

1. **Ativar Required reviewers**
   - Marque a opção **Required reviewers**

2. **Adicionar Aprovadores**
   - Adicione usuários que podem aprovar deploys
   - Exemplo: `sobrinkedos`, outros admins
   - Mínimo: 1 aprovador

3. **Salvar**
   - Clique em **Save protection rules**

#### Tempo de Espera (Opcional)

1. **Ativar Wait timer**
   - Marque a opção **Wait timer**
   - Configure tempo de espera (ex: 5 minutos)
   - Útil para dar tempo de cancelar deploy acidental

#### Branches Permitidas

1. **Deployment branches**
   - Selecione **Selected branches**
   - Adicione: `main`
   - Isso garante que apenas a branch main pode fazer deploy

### Passo 3: Configurar Secrets do Environment

1. **Environment secrets**
   - Na página do environment `production`
   - Seção **Environment secrets**

2. **Adicionar Secrets**
   - Clique em **Add secret**
   - Adicione secrets específicos de produção:

```
PROD_SUPABASE_URL=https://jropngieefxgnufmkeaj.supabase.co
PROD_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Nota:** Estes secrets sobrescrevem os secrets do repositório quando o workflow usa o environment.

### Passo 4: Configurar URL do Environment

1. **Environment URL**
   - Campo **URL** (opcional)
   - Adicione: `https://insight-flow.vercel.app`
   - Isso cria um link direto para a aplicação

## 📊 Resultado

Após configurar, o workflow de deploy:

1. ✅ Inicia normalmente
2. ⏸️ Pausa no job `approval`
3. 📧 Notifica aprovadores
4. ⏳ Aguarda aprovação manual
5. ✅ Continua após aprovação
6. 🚀 Faz deploy em produção

## 🔍 Visualização

### No GitHub Actions

Quando um workflow usa o environment:

```yaml
jobs:
  deploy:
    environment:
      name: production
      url: https://insight-flow.vercel.app
```

Você verá:

```
⏸️ Waiting for approval
   This job requires approval from sobrinkedos
   
   [Review pending deployments]
```

### Aprovar Deploy

1. **Acesse o Workflow**
   - Actions → Workflow em execução

2. **Revisar**
   - Clique em **Review pending deployments**

3. **Aprovar ou Rejeitar**
   - Marque `production`
   - Adicione comentário (opcional)
   - Clique em **Approve and deploy** ou **Reject**

## 🔒 Segurança

### Boas Práticas

1. **Múltiplos Aprovadores**
   - Configure pelo menos 2 aprovadores
   - Evita deploy acidental por uma pessoa

2. **Branches Protegidas**
   - Apenas `main` pode fazer deploy
   - Proteja a branch `main` com:
     - Require pull request reviews
     - Require status checks

3. **Auditoria**
   - GitHub registra todas as aprovações
   - Veja histórico em **Actions** → **Deployments**

4. **Notificações**
   - Configure notificações para aprovadores
   - Settings → Notifications → Actions

## 📝 Exemplo de Uso

### Workflow Completo

```yaml
name: Deploy Produção

on:
  push:
    branches:
      - main

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    
    # Usa o environment com proteções
    environment:
      name: production
      url: https://insight-flow.vercel.app
    
    steps:
      - name: Deploy
        run: echo "Deploying to production..."
```

### Fluxo de Aprovação

```
1. Developer faz push para main
   ↓
2. Workflow inicia automaticamente
   ↓
3. Job aguarda aprovação
   ↓
4. Aprovador recebe notificação
   ↓
5. Aprovador revisa mudanças
   ↓
6. Aprovador aprova ou rejeita
   ↓
7. Se aprovado, deploy continua
   Se rejeitado, workflow cancela
```

## 🆘 Troubleshooting

### Não recebo notificações

**Solução:**
1. Settings → Notifications
2. Ative **Actions**
3. Escolha método (email, web, mobile)

### Não consigo aprovar

**Solução:**
1. Verifique se você está na lista de aprovadores
2. Verifique permissões no repositório
3. Precisa ter pelo menos permissão de **Write**

### Workflow não aguarda aprovação

**Solução:**
1. Verifique se o job usa `environment: production`
2. Confirme que o environment tem **Required reviewers**
3. Verifique se a branch está permitida

### Múltiplas aprovações pendentes

**Solução:**
1. Cancele workflows antigos
2. Actions → Workflow → Cancel workflow
3. Mantenha apenas o mais recente

## 📚 Referências

- [GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [Deployment Protection Rules](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#deployment-protection-rules)
- [Required Reviewers](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#required-reviewers)

---

**Última atualização:** 2025-01-27
