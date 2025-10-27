# Diretório Supabase - Migrações e Seeds

Este diretório contém as migrações de banco de dados e dados de seed para o projeto.

## Estrutura

```
supabase/
├── migrations/          # Migrações de banco de dados
│   └── YYYYMMDDHHMMSS_nome_da_migracao.sql
├── seed/               # Dados de seed por ambiente
│   ├── development.sql
│   └── test.sql
├── config.toml         # Configuração do Supabase CLI
└── README.md           # Este arquivo
```

## Migrações

### Formato de Nomenclatura

As migrações seguem o formato: `YYYYMMDDHHMMSS_nome_descritivo.sql`

Exemplo: `20250127000000_initial_schema.sql`

### Criar Nova Migração

```bash
# Criar migração manualmente
# Crie um arquivo em supabase/migrations/ com o timestamp atual

# Exemplo de nome
20250127120000_add_users_table.sql
```

### Aplicar Migrações

```bash
# Desenvolvimento
npm run migrate:dev

# Teste
npm run migrate:test

# Produção (requer aprovação)
npm run migrate:prod
```

## Seeds

### Arquivos de Seed

- `development.sql` - Dados para ambiente de desenvolvimento
- `test.sql` - Dados para ambiente de teste/staging

⚠️ **Não há seed para produção** - Dados de produção são reais e não devem ser sobrescritos

### Aplicar Seeds

```bash
# Desenvolvimento
npm run seed:dev

# Teste
npm run seed:test
```

## Tabelas de Controle

### migration_history

Rastreia todas as migrações aplicadas:

```sql
SELECT * FROM public.migration_history
ORDER BY applied_at DESC;
```

Colunas principais:
- `version` - Versão da migração (timestamp)
- `name` - Nome descritivo
- `applied_at` - Quando foi aplicada
- `status` - success, failed, rolled_back
- `environment` - development, test, production

### backup_history

Rastreia todos os backups realizados:

```sql
SELECT * FROM public.backup_history
ORDER BY timestamp DESC;
```

Colunas principais:
- `timestamp` - Quando o backup foi feito
- `type` - daily, weekly, monthly, manual, pre_migration
- `status` - in_progress, completed, failed, verified
- `size_mb` - Tamanho do backup
- `retention_until` - Até quando manter

### resource_usage

Monitora uso de recursos:

```sql
SELECT * FROM public.resource_usage
ORDER BY measured_at DESC;
```

Colunas principais:
- `project_name` - Nome do projeto
- `storage_mb` - Armazenamento usado
- `bandwidth_mb` - Largura de banda usada
- `storage_limit_mb` - Limite (500MB tier gratuito)
- `bandwidth_limit_mb` - Limite (2GB tier gratuito)

## Views Úteis

### latest_migrations

Última migração aplicada em cada ambiente:

```sql
SELECT * FROM public.latest_migrations;
```

### recent_backups

Backups dos últimos 30 dias:

```sql
SELECT * FROM public.recent_backups;
```

### resource_alerts

Alertas de uso de recursos:

```sql
SELECT * FROM public.resource_alerts
WHERE alert_level IN ('warning', 'critical');
```

## Boas Práticas

### Criando Migrações

✅ **Faça:**
- Use nomes descritivos
- Inclua comentários explicativos
- Teste em desenvolvimento primeiro
- Faça backup antes de aplicar em produção
- Use transações quando possível
- Documente mudanças breaking

❌ **Não Faça:**
- Modificar migrações já aplicadas
- Fazer mudanças breaking sem aviso
- Aplicar direto em produção
- Esquecer de testar rollback

### Exemplo de Migração

```sql
-- Migração: Adicionar tabela de usuários
-- Data: 2025-01-27
-- Descrição: Cria tabela users com campos básicos

BEGIN;

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_users_email ON public.users(email);

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Users can view own data"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- Registrar migração
INSERT INTO public.migration_history (
    version,
    name,
    status,
    environment
) VALUES (
    '20250127120000',
    'add_users_table',
    'success',
    current_setting('app.environment', true)
);

COMMIT;
```

## Rollback

### Desenvolvimento e Teste

```bash
# Reverter última migração
npm run migrate:rollback:dev
npm run migrate:rollback:test
```

### Produção

⚠️ **Rollback em produção requer backup prévio**

O sistema automaticamente:
1. Verifica se há backup recente
2. Cria backup antes do rollback
3. Aplica o rollback
4. Verifica integridade

## Troubleshooting

### Migração falhou

1. Verifique os logs de erro
2. Corrija o SQL da migração
3. Faça rollback se necessário
4. Reaplique a migração corrigida

### Conflito de versão

Se duas migrações tiverem o mesmo timestamp:
1. Renomeie uma delas com timestamp diferente
2. Mantenha ordem cronológica
3. Reaplique em ordem

### Dados de seed não carregam

1. Verifique se as tabelas existem
2. Confirme que as migrações foram aplicadas
3. Verifique permissões
4. Veja logs de erro

## Referências

- [Supabase Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Design Document](../docs/INFRAESTRUTURA.md)
