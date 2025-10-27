# Configurar GitHub Secrets para Backup

## Visão Geral

O workflow de backup automático requer secrets configurados no GitHub para
acessar os bancos de dados de produção e backup.

## Secrets Necessários

### 1. PROD_SUPABASE_DB_URL

URL de conexão direta ao banco de dados de produção.

**Formato:**

```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Como obter:**

1. Acesse https://supabase.com/dashboard/project/jropngieefxgnufmkeaj
2. Vá em **Settings** > **Database**
3. Role até **Connection string**
4. Selecione **URI** mode
5. Copie a string completa
6. Substitua `[YOUR-PASSWORD]` pela senha do banco: `dogRyjsEfOYVtd5H`

**Valor final:**

```
postgresql://postgres:dogRyjsEfOYVtd5H@db.jropngieefxgnufmkeaj.supabase.co:5432/postgres
```

### 2. BACKUP_SUPABASE_DB_URL

URL de conexão direta ao banco de dados de backup.

**Formato:**

```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Como obter:**

1. Acesse https://supabase.com/dashboard/project/vewrtrnqubvmipfgnxlv
2. Vá em **Settings** > **Database**
3. Role até **Connection string**
4. Selecione **URI** mode
5. Copie a string completa
6. Substitua `[YOUR-PASSWORD]` pela senha do banco: `NuEmt9MicyIvE3Oa`

**Valor final:**

```
postgresql://postgres:NuEmt9MicyIvE3Oa@db.vewrtrnqubvmipfgnxlv.supabase.co:5432/postgres
```

## Passo a Passo para Adicionar Secrets

### 1. Acessar Configurações do Repositório

1. Acesse https://github.com/sobrinkedos/insightFlow
2. Clique em **Settings** (aba superior)
3. No menu lateral, clique em **Secrets and variables** > **Actions**

### 2. Adicionar PROD_SUPABASE_DB_URL

1. Clique em **New repository secret**
2. **Name:** `PROD_SUPABASE_DB_URL`
3. **Secret:** Cole a URL de conexão do banco de produção
4. Clique em **Add secret**

### 3. Adicionar BACKUP_SUPABASE_DB_URL

1. Clique em **New repository secret**
2. **Name:** `BACKUP_SUPABASE_DB_URL`
3. **Secret:** Cole a URL de conexão do banco de backup
4. Clique em **Add secret**

## Verificação

Após adicionar os secrets, você deve ver:

```
✓ PROD_SUPABASE_DB_URL
✓ BACKUP_SUPABASE_DB_URL
```

## Testar o Workflow

### Execução Manual

1. Vá em **Actions** no repositório
2. Selecione **Backup Produção** no menu lateral
3. Clique em **Run workflow**
4. Selecione o tipo de backup (manual, daily, pre_migration)
5. Clique em **Run workflow**

### Verificar Logs

1. Após executar, clique no workflow em execução
2. Clique no job **Backup do Banco de Produção**
3. Expanda os steps para ver os logs detalhados

## Troubleshooting

### Erro: "connection refused"

**Causa:** URL de conexão incorreta ou firewall bloqueando

**Solução:**

1. Verifique se a URL está correta
2. Confirme que o projeto Supabase está ativo (não pausado)
3. Verifique se a senha está correta

### Erro: "authentication failed"

**Causa:** Senha incorreta

**Solução:**

1. Verifique a senha no dashboard do Supabase
2. Atualize o secret com a senha correta
3. Tente novamente

### Erro: "permission denied"

**Causa:** Usuário sem permissões adequadas

**Solução:**

1. Certifique-se de usar o usuário `postgres`
2. Verifique as permissões no Supabase

### Workflow não executa automaticamente

**Causa:** Cron schedule pode levar até 1 hora para ativar

**Solução:**

1. Execute manualmente primeiro para testar
2. Aguarde até o próximo horário agendado (2h AM UTC)
3. Verifique se o workflow está habilitado

## Segurança

### ✅ Boas Práticas

- Secrets são criptografados pelo GitHub
- Nunca exponha secrets em logs
- Use secrets apenas em workflows privados
- Rotacione senhas periodicamente

### ❌ Nunca Faça

- Commitar secrets no código
- Imprimir secrets nos logs
- Compartilhar secrets publicamente
- Usar mesma senha em múltiplos ambientes

## Monitoramento

### Verificar Backups Realizados

Conecte ao banco de backup e execute:

```sql
SELECT 
  timestamp,
  type,
  size_mb,
  status,
  verification_status
FROM public.backup_history
ORDER BY timestamp DESC
LIMIT 10;
```

### Verificar Próxima Execução

1. Vá em **Actions** > **Backup Produção**
2. Veja "Next scheduled run" no topo

### Alertas

O workflow enviará notificações em caso de:

- ✅ Sucesso do backup
- ❌ Falha no backup
- ⚠️ Verificação de integridade falhou

## Referências

- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Supabase Database Connection](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [PostgreSQL pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)

---

**Última atualização:** 2025-01-27
