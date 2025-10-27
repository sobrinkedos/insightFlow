# Sistema de Backup Automatizado

## Visão Geral

O sistema de backup automatizado garante que o banco de dados de produção seja copiado regularmente para o projeto de backup, compensando a ausência de backups nativos no tier gratuito do Supabase.

## Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                   GitHub Actions                        │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Workflow: backup-production.yml                 │  │
│  │                                                   │  │
│  │  Triggers:                                        │  │
│  │  • Schedule (diário às 2h AM)                    │  │
│  │  • Manual (workflow_dispatch)                    │  │
│  │  • Pós-migração (repository_dispatch)            │  │
│  └──────────────────────────────────────────────────┘  │
│                          │                              │
└──────────────────────────┼──────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │     1. Export (pg_dump)          │
        │     Produção → Arquivo SQL       │
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │     2. Import (psql)             │
        │     Arquivo SQL → Backup         │
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │     3. Verificação               │
        │     Comparar contagens           │
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │     4. Registro                  │
        │     backup_history table         │
        └──────────────────────────────────┘
```

## Tipos de Backup

### 1. Daily (Diário)
- **Quando:** Todos os dias às 2h AM (UTC)
- **Trigger:** Schedule automático
- **Retenção:** 30 dias
- **Uso:** Backup regular de rotina

### 2. Manual
- **Quando:** Sob demanda
- **Trigger:** Execução manual ou via API
- **Retenção:** 30 dias
- **Uso:** Backup antes de operações críticas

### 3. Pre-Migration
- **Quando:** Antes de aplicar migrações em produção
- **Trigger:** Automático via repository_dispatch
- **Retenção:** 30 dias
- **Uso:** Ponto de restauração antes de mudanças no schema

## Configuração

### Pré-requisitos

1. **GitHub Secrets configurados:**
   - `PROD_SUPABASE_DB_URL` - URL do banco de produção
   - `BACKUP_SUPABASE_DB_URL` - URL do banco de backup

2. **Tabela backup_history criada:**
   ```bash
   npm run migrate:prod
   ```

### Passo a Passo

Siga o guia completo: [CONFIGURAR-GITHUB-SECRETS.md](./CONFIGURAR-GITHUB-SECRETS.md)

## Uso

### Backup Manual

#### Via GitHub Interface

1. Acesse https://github.com/sobrinkedos/insightFlow/actions
2. Selecione **Backup Produção**
3. Clique em **Run workflow**
4. Selecione o tipo de backup
5. Clique em **Run workflow**

#### Via Linha de Comando

```bash
# Configurar token do GitHub
export GITHUB_TOKEN=ghp_your_token_here

# Disparar backup manual
npm run backup:trigger

# Disparar backup pós-migração
npm run backup:post-migration
```

### Backup Automático

O backup diário é executado automaticamente às 2h AM (UTC) todos os dias.

Não requer ação manual.

### Backup Pós-Migração

Ao executar migrações em produção com o script seguro:

```bash
npm run migrate:prod:safe
```

O backup é disparado automaticamente antes da migração.

## Monitoramento

### Verificar Backups Realizados

Conecte ao banco de backup:

```sql
-- Últimos 10 backups
SELECT 
  timestamp,
  type,
  size_mb,
  status,
  verification_status,
  retention_until
FROM public.backup_history
ORDER BY timestamp DESC
LIMIT 10;
```

### Verificar Backups Recentes

```sql
-- Backups dos últimos 7 dias
SELECT * FROM public.recent_backups
WHERE timestamp > NOW() - INTERVAL '7 days';
```

### Verificar Status de Retenção

```sql
-- Backups próximos de expirar
SELECT 
  timestamp,
  type,
  size_mb,
  retention_until,
  retention_until - NOW() as time_until_expiry
FROM public.backup_history
WHERE retention_until < NOW() + INTERVAL '7 days'
  AND status = 'completed'
ORDER BY retention_until;
```

## Verificação de Integridade

O workflow automaticamente:

1. **Compara contagens** de registros entre produção e backup
2. **Registra o resultado** na coluna `verification_status`
3. **Alerta** se houver discrepâncias

### Verificação Manual

```sql
-- Comparar contagem de tabelas
SELECT 
  'production' as source,
  COUNT(*) as migration_count
FROM public.migration_history
UNION ALL
SELECT 
  'backup' as source,
  COUNT(*) as migration_count
FROM public.migration_history;
```

## Restauração

### Quando Restaurar

- Corrupção de dados em produção
- Migração falhou e não pode ser revertida
- Perda acidental de dados
- Desastre no projeto de produção

### Processo de Restauração

⚠️ **CUIDADO:** Restauração sobrescreve todos os dados de produção!

1. **Identificar backup a restaurar:**
```sql
SELECT id, timestamp, type, size_mb, verification_status
FROM public.backup_history
WHERE status = 'completed'
  AND verification_status = 'true'
ORDER BY timestamp DESC;
```

2. **Criar backup do estado atual:**
```bash
npm run backup:trigger
```

3. **Exportar backup escolhido:**
```bash
# Conectar ao banco de backup
pg_dump $BACKUP_DB_URL > restore_point.sql
```

4. **Restaurar em produção:**
```bash
# ⚠️ ATENÇÃO: Isso sobrescreve produção!
psql $PROD_DB_URL < restore_point.sql
```

5. **Verificar integridade:**
```sql
-- Verificar dados críticos
SELECT COUNT(*) FROM public.migration_history;
SELECT COUNT(*) FROM public.backup_history;
-- Verificar suas tabelas de aplicação
```

## Política de Retenção

### Padrão

- **Todos os backups:** 30 dias
- **Limpeza automática:** Backups expirados são marcados como 'expired'

### Customizar Retenção

Para manter um backup por mais tempo:

```sql
UPDATE public.backup_history
SET retention_until = NOW() + INTERVAL '90 days'
WHERE id = 'backup-id-here';
```

## Alertas e Notificações

### Falha no Backup

O workflow envia notificação se:
- Export falhar
- Import falhar
- Verificação falhar
- Qualquer step falhar

### Configurar Notificações

Edite `.github/workflows/backup-production.yml`:

```yaml
- name: Enviar notificação de falha
  if: failure()
  run: |
    # Adicione integração com:
    # - Slack
    # - Email
    # - Discord
    # - Webhook customizado
```

## Troubleshooting

### Backup não executa automaticamente

**Causa:** Schedule pode levar até 1 hora para ativar

**Solução:**
1. Execute manualmente primeiro
2. Aguarde próximo horário agendado
3. Verifique se workflow está habilitado

### Erro: "connection refused"

**Causa:** URL incorreta ou projeto pausado

**Solução:**
1. Verifique URL nos secrets
2. Confirme que projeto está ativo
3. Teste conexão manualmente

### Erro: "authentication failed"

**Causa:** Senha incorreta

**Solução:**
1. Verifique senha no Supabase Dashboard
2. Atualize secret no GitHub
3. Tente novamente

### Verificação de integridade falha

**Causa:** Dados diferentes entre produção e backup

**Solução:**
1. Verifique se há escritas durante o backup
2. Execute backup novamente
3. Investigue discrepâncias manualmente

### Backup muito grande

**Causa:** Dados cresceram além do esperado

**Solução:**
1. Verifique uso de storage
2. Considere arquivar dados antigos
3. Avalie upgrade para plano pago

## Limites e Considerações

### Tier Gratuito Supabase

- **Storage:** 500MB por projeto
- **Bandwidth:** 2GB/mês por projeto
- **Backups:** Contam para storage e bandwidth

### Estimativas

Se seu banco tem 100MB:
- Backup diário: ~3GB/mês de bandwidth
- Storage no backup: ~100MB (sobrescreve)

### Otimizações

1. **Compressão:** Considere comprimir backups antigos
2. **Seletividade:** Backup apenas tabelas críticas
3. **Frequência:** Ajuste schedule se necessário

## Segurança

### ✅ Boas Práticas

- Secrets criptografados no GitHub
- Conexões via SSL
- Acesso restrito ao banco de backup
- Logs não expõem credenciais

### ❌ Evite

- Commitar secrets no código
- Expor URLs de conexão
- Desabilitar verificação de integridade
- Ignorar alertas de falha

## Métricas

### KPIs do Sistema de Backup

```sql
-- Taxa de sucesso (últimos 30 dias)
SELECT 
  COUNT(*) FILTER (WHERE status = 'completed') * 100.0 / COUNT(*) as success_rate,
  COUNT(*) as total_backups,
  AVG(size_mb) as avg_size_mb
FROM public.backup_history
WHERE timestamp > NOW() - INTERVAL '30 days';
```

### Metas

- **Taxa de sucesso:** > 99%
- **Tempo de execução:** < 5 minutos
- **Verificação:** 100% dos backups verificados

## Referências

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [PostgreSQL pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)
- [Supabase Database](https://supabase.com/docs/guides/database)
- [Configurar Secrets](./CONFIGURAR-GITHUB-SECRETS.md)

---

**Última atualização:** 2025-01-27
