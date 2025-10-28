# 🚀 Sistema Multi-Ambiente InsightFlow - Guia Completo

## 📋 Visão Geral

Este documento descreve o sistema multi-ambiente completo implementado para o projeto InsightFlow, incluindo infraestrutura, configuração, uso e manutenção.

---

## 🏗️ Arquitetura do Sistema

### 1. Ambientes Supabase (4 Projetos)

#### **Conta A - Desenvolvimento**

**Development (enkpfnqsjjnanlqhjnsv)**
- **Uso:** Desenvolvimento ativo, testes locais
- **Branch Git:** `development`
- **URL:** https://enkpfnqsjjnanlqhjnsv.supabase.co
- **Características:**
  - Dados de teste/mock
  - RLS permissivo
  - Pode ser resetado a qualquer momento

**Test/Staging (bosxuteortfshfysoqrd)**
- **Uso:** Testes de integração, staging
- **Branch Git:** `staging`
- **URL:** https://bosxuteortfshfysoqrd.supabase.co
- **Características:**
  - Dados similares a produção (anonimizados)
  - RLS similar a produção
  - Ambiente de homologação

#### **Conta B - Produção**

**Production (jropngieefxgnufmkeaj)**
- **Uso:** Ambiente de produção
- **Branch Git:** `main`
- **URL:** https://jropngieefxgnufmkeaj.supabase.co
- **Características:**
  - Dados reais de usuários
  - RLS restritivo
  - Backup automático diário
  - Migrações controladas

**Backup (vewrtrnqubvmipfgnxlv)**
- **Uso:** Backup automático de produção
- **URL:** https://vewrtrnqubvmipfgnxlv.supabase.co
- **Características:**
  - Somente leitura
  - Backup diário às 2h AM
  - Retenção de 30 dias
  - Restauração de emergência

---

## 🌳 Estrutura de Branches Git

### Development
```bash
git checkout development
git push origin development
```
- Deploy automático na Vercel (Preview)
- Conecta ao Supabase Development
- Usado para desenvolvimento ativo

### Staging
```bash
git checkout staging
git push origin staging
```
- Deploy automático na Vercel (Preview)
- Conecta ao Supabase Test
- Usado para testes antes de produção

### Main (Production)
```bash
git checkout main
git push origin main
```
- Deploy automático na Vercel (Production)
- Conecta ao Supabase Production
- Ambiente de produção real

---

## 🔧 Configuração de Variáveis de Ambiente

### Variáveis por Ambiente

#### Development (Preview)
```bash
VITE_SUPABASE_URL=https://enkpfnqsjjnanlqhjnsv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ENVIRONMENT=development
```

#### Staging (Preview)
```bash
VITE_SUPABASE_URL=https://bosxuteortfshfysoqrd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ENVIRONMENT=test
```

#### Production
```bash
VITE_SUPABASE_URL=https://jropngieefxgnufmkeaj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ENVIRONMENT=production
```

### Como Configurar na Vercel

1. Acesse: **Settings → Environment Variables**
2. Para cada variável:
   - **Preview:** Marque para branches development/staging
   - **Production:** Marque para branch main
3. Salve e faça redeploy

---

## 📦 Sistema de Migrações

### Comandos Disponíveis

```bash
# Development
npm run migrate:dev              # Aplica migrações em dev
npm run migrate:rollback:dev     # Reverte última migração

# Test/Staging
npm run migrate:test             # Aplica migrações em test
npm run migrate:rollback:test    # Reverte última migração

# Production
npm run migrate:prod             # Aplica com confirmação
npm run migrate:prod:safe        # Aplica com backup automático (RECOMENDADO)
```

### Criar Nova Migração

1. **Criar arquivo:**
```bash
supabase/migrations/YYYYMMDDHHMMSS_descricao.sql
```

2. **Escrever SQL:**
```sql
-- Migração: Descrição
-- Data: YYYY-MM-DD

BEGIN;

-- Suas mudanças aqui
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL
);

COMMIT;
```

3. **Testar em development:**
```bash
npm run migrate:dev
```

4. **Promover para staging:**
```bash
git checkout staging
git merge development
git push origin staging
npm run migrate:test
```

5. **Promover para produção:**
```bash
git checkout main
git merge staging
git push origin main
npm run migrate:prod:safe  # Com backup automático
```

---

## 💾 Sistema de Backup

### Backup Automático

**Frequência:** Diário às 2h AM (UTC)

**Processo:**
1. GitHub Actions dispara workflow
2. Export do banco de produção (pg_dump)
3. Import para banco de backup
4. Verificação de integridade
5. Registro na tabela `backup_history`
6. Cleanup de backups antigos (>30 dias)

### Backup Manual

```bash
# Via GitHub Actions
# Acesse: https://github.com/sobrinkedos/insightFlow/actions
# Selecione: Backup Produção → Run workflow

# Via CLI (requer GITHUB_TOKEN)
export GITHUB_TOKEN=ghp_seu_token
npm run backup:trigger
```

### Restaurar Backup

⚠️ **CUIDADO:** Restauração sobrescreve dados de produção!

1. **Listar backups disponíveis:**
```sql
SELECT id, timestamp, type, size_mb, verification_status
FROM backup_history
WHERE status = 'completed'
ORDER BY timestamp DESC;
```

2. **Criar backup do estado atual:**
```bash
npm run backup:trigger
```

3. **Restaurar:**
```bash
# Conectar ao banco de backup
pg_dump $BACKUP_DB_URL > restore_point.sql

# Restaurar em produção
psql $PROD_DB_URL < restore_point.sql
```

---

## 🌐 Deploy na Vercel

### URLs dos Deployments

Após cada push, a Vercel gera URLs:

**Development:**
- Preview: `https://insight-flow-git-development-[user].vercel.app`
- Unique: `https://insight-flow-[hash].vercel.app`

**Staging:**
- Preview: `https://insight-flow-git-staging-[user].vercel.app`
- Unique: `https://insight-flow-[hash].vercel.app`

**Production:**
- Production: `https://insight-flow.vercel.app`
- Ou seu domínio customizado

### Verificar Status

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto
3. Vá na aba **Deployments**
4. Veja status de cada branch

### Redeploy Manual

1. Na aba Deployments
2. Clique nos 3 pontos do deployment
3. Selecione **Redeploy**
4. Marque/desmarque **Use existing Build Cache**
5. Clique em **Redeploy**

---

## 🔄 Fluxo de Trabalho Recomendado

### 1. Desenvolvimento de Feature

```bash
# 1. Criar branch de feature
git checkout development
git pull origin development
git checkout -b feature/nova-funcionalidade

# 2. Desenvolver e testar localmente
npm run dev

# 3. Criar migração se necessário
# Criar arquivo em supabase/migrations/

# 4. Testar migração em dev
npm run migrate:dev

# 5. Commit e push
git add .
git commit -m "feat: adicionar nova funcionalidade"
git push origin feature/nova-funcionalidade

# 6. Criar Pull Request para development
# Via GitHub interface

# 7. Após aprovação, merge para development
git checkout development
git merge feature/nova-funcionalidade
git push origin development
```

### 2. Promover para Staging

```bash
# 1. Merge development → staging
git checkout staging
git pull origin staging
git merge development
git push origin staging

# 2. Aplicar migrações em test
npm run migrate:test

# 3. Testar no ambiente de staging
# Acessar URL de preview da Vercel

# 4. Validar funcionalidades
```

### 3. Deploy em Produção

```bash
# 1. Merge staging → main
git checkout main
git pull origin main
git merge staging
git push origin main

# 2. Aplicar migrações com backup
npm run migrate:prod:safe

# 3. Verificar deploy
# Acessar URL de produção

# 4. Monitorar logs e métricas
```

---

## 📊 Monitoramento

### Verificar Uso de Recursos

```sql
-- Uso atual
SELECT 
  project_name,
  environment,
  storage_mb,
  bandwidth_mb,
  database_size_mb,
  measured_at
FROM resource_usage
ORDER BY measured_at DESC
LIMIT 10;

-- Alertas de limite
SELECT * FROM resource_alerts
WHERE alert_level IN ('warning', 'critical');
```

### Verificar Backups

```sql
-- Backups recentes
SELECT * FROM recent_backups
ORDER BY timestamp DESC
LIMIT 10;

-- Status de backups
SELECT 
  type,
  COUNT(*) as total,
  AVG(size_mb) as avg_size_mb,
  MAX(timestamp) as last_backup
FROM backup_history
WHERE status = 'completed'
GROUP BY type;
```

### Verificar Migrações

```sql
-- Migrações por ambiente
SELECT 
  environment,
  COUNT(*) as total_migrations,
  MAX(applied_at) as last_migration
FROM migration_history
WHERE status = 'success'
GROUP BY environment;

-- Última migração
SELECT * FROM latest_migrations;
```

---

## 🛠️ Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev                    # Servidor de desenvolvimento
npm run build                  # Build de produção
npm run preview                # Preview do build
```

### Migrações
```bash
npm run migrate:dev            # Migração em development
npm run migrate:test           # Migração em test
npm run migrate:prod           # Migração em production
npm run migrate:prod:safe      # Migração com backup
npm run migrate:rollback:dev   # Rollback em development
npm run migrate:rollback:test  # Rollback em test
```

### Seeds
```bash
npm run seed:dev               # Seed em development
npm run seed:test              # Seed em test
```

### Backup
```bash
npm run backup:trigger         # Trigger backup manual
npm run backup:post-migration  # Backup pós-migração
```

### Verificação
```bash
npm run verify-env             # Verificar variáveis de ambiente
```

---

## 📚 Documentação Adicional

### Guias de Setup
- [SETUP-VERCEL-RAPIDO.md](./SETUP-VERCEL-RAPIDO.md) - Setup rápido da Vercel
- [VERCEL-ONDE-ENCONTRAR-IDS.md](./VERCEL-ONDE-ENCONTRAR-IDS.md) - Como encontrar IDs
- [CONFIGURAR-GITHUB-SECRETS.md](./CONFIGURAR-GITHUB-SECRETS.md) - Configurar secrets

### Guias de Uso
- [GUIA-MIGRACOES.md](./GUIA-MIGRACOES.md) - Guia completo de migrações
- [SISTEMA-BACKUP.md](./SISTEMA-BACKUP.md) - Sistema de backup
- [INFRAESTRUTURA.md](./INFRAESTRUTURA.md) - Infraestrutura completa

### Troubleshooting
- [TROUBLESHOOTING-VERCEL.md](./TROUBLESHOOTING-VERCEL.md) - Problemas com Vercel
- [IMPORTAR-VARIAVEIS-VERCEL-CORRIGIDO.md](./IMPORTAR-VARIAVEIS-VERCEL-CORRIGIDO.md) - Variáveis de ambiente

---

## ⚠️ Boas Práticas

### ✅ Faça

1. **Sempre teste em development primeiro**
2. **Use `migrate:prod:safe` para produção** (com backup automático)
3. **Verifique logs após cada deploy**
4. **Mantenha documentação atualizada**
5. **Faça backup manual antes de mudanças críticas**
6. **Use branches de feature para desenvolvimento**
7. **Revise código antes de merge para main**

### ❌ Não Faça

1. **Nunca faça push direto para main sem testar**
2. **Nunca aplique migrações em produção sem backup**
3. **Nunca commite credenciais no código**
4. **Nunca modifique migrações já aplicadas**
5. **Nunca delete backups manualmente**
6. **Nunca use dados reais em development**
7. **Nunca desabilite RLS em produção**

---

## 🚨 Procedimentos de Emergência

### Deploy Falhou em Produção

1. **Verificar logs na Vercel**
2. **Fazer rollback se necessário:**
   ```bash
   # Via Vercel: Redeploy versão anterior
   # Ou via Git:
   git revert HEAD
   git push origin main
   ```

### Migração Falhou em Produção

1. **NÃO ENTRE EM PÂNICO**
2. **Verificar estado do banco:**
   ```sql
   SELECT * FROM migration_history
   WHERE environment = 'production'
   ORDER BY applied_at DESC
   LIMIT 5;
   ```
3. **Se necessário, restaurar backup:**
   - Seguir procedimento de restauração
   - Documentar o incidente

### Perda de Dados

1. **Identificar último backup válido**
2. **Criar backup do estado atual**
3. **Restaurar do backup**
4. **Verificar integridade dos dados**
5. **Documentar causa e solução**

---

## 📞 Suporte

### Recursos

- **Documentação:** `/docs`
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repository:** https://github.com/sobrinkedos/insightFlow

### Contatos

- **Supabase Support:** https://supabase.com/support
- **Vercel Support:** https://vercel.com/support
- **GitHub Issues:** https://github.com/sobrinkedos/insightFlow/issues

---

## 🎯 Checklist de Manutenção

### Diário
- [ ] Verificar status dos deployments
- [ ] Verificar logs de erro
- [ ] Verificar backup automático executou

### Semanal
- [ ] Revisar uso de recursos
- [ ] Verificar integridade dos backups
- [ ] Limpar branches antigas
- [ ] Atualizar dependências (se necessário)

### Mensal
- [ ] Revisar e otimizar queries lentas
- [ ] Verificar espaço em disco
- [ ] Revisar políticas RLS
- [ ] Atualizar documentação
- [ ] Testar procedimento de restauração

---

**Última atualização:** 2025-01-28  
**Versão:** 1.0  
**Status:** ✅ Sistema Completo e Funcionando
