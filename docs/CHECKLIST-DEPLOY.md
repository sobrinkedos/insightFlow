# Checklist de Configuração de Deploy

## 📋 Pré-Deploy

### GitHub

- [ ] Repositório criado e código commitado
- [ ] Branches criadas: `development`, `staging`, `main`
- [ ] Secrets configurados no GitHub Actions:
  - [ ] `VERCEL_TOKEN`
  - [ ] `VERCEL_ORG_ID`
  - [ ] `VERCEL_PROJECT_ID`
  - [ ] `PROD_SUPABASE_URL`
  - [ ] `PROD_SUPABASE_ANON_KEY`
  - [ ] `PROD_SUPABASE_DB_URL`
  - [ ] `BACKUP_SUPABASE_DB_URL`
  - [ ] `GITHUB_TOKEN` (opcional, para trigger de backup)

### Supabase

- [ ] 4 projetos criados:
  - [ ] Development (Conta A)
  - [ ] Test (Conta A)
  - [ ] Production (Conta B)
  - [ ] Backup (Conta B)
- [ ] Migrações aplicadas em todos os ambientes
- [ ] Tabelas de controle criadas (`migration_history`, `backup_history`, `resource_usage`)
- [ ] Service Role Keys obtidas para todos os projetos

### Vercel

- [ ] Conta criada e vinculada ao GitHub
- [ ] Projeto criado no Vercel
- [ ] Tokens e IDs obtidos:
  - [ ] `VERCEL_TOKEN`
  - [ ] `VERCEL_ORG_ID`
  - [ ] `VERCEL_PROJECT_ID`

## 🔧 Configuração Vercel

### Configurações Gerais

- [ ] Framework: Vite
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm ci`
- [ ] Node Version: 20.x

### Git Configuration

- [ ] Production Branch: `main`
- [ ] Auto-deploy para `main`: ❌ DESABILITADO
- [ ] Branch Deployments configuradas:
  - [ ] `development` - Auto-deploy ✅
  - [ ] `staging` - Auto-deploy ✅

### Environment Variables - Production

- [ ] `VITE_SUPABASE_URL` = `https://jropngieefxgnufmkeaj.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` = (anon key de produção)
- [ ] `VITE_ENVIRONMENT` = `production`

### Environment Variables - Preview (development)

- [ ] `VITE_SUPABASE_URL` = `https://enkpfnqsjjnanlqhjnsv.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` = (anon key de desenvolvimento)
- [ ] `VITE_ENVIRONMENT` = `development`

### Environment Variables - Preview (staging)

- [ ] `VITE_SUPABASE_URL` = `https://bosxuteortfshfysoqrd.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` = (anon key de teste)
- [ ] `VITE_ENVIRONMENT` = `test`

### Domínios (Opcional)

- [ ] Domínio customizado configurado
- [ ] DNS configurado
- [ ] SSL ativo

## 🚀 Workflows GitHub Actions

### Backup Production

- [ ] Arquivo `.github/workflows/backup-production.yml` existe
- [ ] Schedule configurado (diário às 2h AM)
- [ ] Secrets configurados
- [ ] Testado manualmente

### Deploy Production

- [ ] Arquivo `.github/workflows/deploy-production.yml` existe
- [ ] Environment `production` criado no GitHub
- [ ] Aprovadores configurados
- [ ] Testado manualmente

## ✅ Testes

### Desenvolvimento

- [ ] Push para `development` dispara deploy automático
- [ ] URL de preview funciona
- [ ] Conecta ao banco de desenvolvimento
- [ ] Variáveis de ambiente carregam corretamente

### Staging

- [ ] Push para `staging` dispara deploy automático
- [ ] URL de preview funciona
- [ ] Conecta ao banco de teste
- [ ] Variáveis de ambiente carregam corretamente

### Produção

- [ ] Push para `main` dispara workflow
- [ ] Workflow aguarda aprovação manual
- [ ] Após aprovação, build executa
- [ ] Deploy para produção funciona
- [ ] URL de produção funciona
- [ ] Conecta ao banco de produção
- [ ] Variáveis de ambiente carregam corretamente

### Backup

- [ ] Backup manual funciona
- [ ] Backup diário está agendado
- [ ] Backup pós-migração funciona
- [ ] Dados são copiados corretamente
- [ ] Verificação de integridade passa

### Rollback

- [ ] Rollback manual via Vercel funciona
- [ ] Script `npm run deploy:rollback` funciona
- [ ] Rollback automático em caso de falha funciona

## 📊 Monitoramento

### Vercel

- [ ] Analytics configurado
- [ ] Logs acessíveis
- [ ] Alertas configurados (opcional)

### GitHub

- [ ] Actions executando corretamente
- [ ] Notificações de falha configuradas
- [ ] Histórico de deploys visível

### Supabase

- [ ] Dashboards acessíveis
- [ ] Uso de recursos monitorado
- [ ] Backups verificados regularmente

## 📚 Documentação

- [ ] README.md atualizado
- [ ] DEPLOY-VERCEL.md criado
- [ ] SETUP-VERCEL-RAPIDO.md criado
- [ ] CHECKLIST-DEPLOY.md criado (este arquivo)
- [ ] Equipe treinada nos procedimentos

## 🔒 Segurança

- [ ] Secrets não commitados no código
- [ ] Service Role Keys protegidas
- [ ] Acesso ao Vercel restrito
- [ ] Acesso ao Supabase de produção restrito
- [ ] Aprovadores de deploy definidos
- [ ] Processo de rotação de credenciais documentado

## 🎯 Próximos Passos

Após completar este checklist:

1. [ ] Fazer deploy de teste em desenvolvimento
2. [ ] Fazer deploy de teste em staging
3. [ ] Fazer deploy de teste em produção (com aprovação)
4. [ ] Testar rollback
5. [ ] Testar backup automático
6. [ ] Documentar qualquer problema encontrado
7. [ ] Treinar equipe nos procedimentos

## 📝 Notas

Use este espaço para anotar observações específicas do seu projeto:

```
Data de configuração: _____________________
Configurado por: _____________________
Observações:
_____________________
_____________________
_____________________
```

---

**Status:** ⬜ Não iniciado | 🟡 Em progresso | ✅ Completo

**Última atualização:** 2025-01-27
