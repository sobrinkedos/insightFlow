# Documentação da Infraestrutura Multi-Ambiente

## Visão Geral

Este documento descreve a infraestrutura completa de múltiplos ambientes
configurada para o projeto InsightFlow, utilizando duas contas gratuitas do
Supabase, Vercel para hospedagem e GitHub para versionamento.

## Estrutura de Contas Supabase

### Conta Supabase A (ril.tons@gmail.com)

**Organização:** insightShare

#### Projeto 1 - Desenvolvimento (insightDev)

- **Project ID:** enkpfnqsjjnanlqhjnsv
- **Project URL:** https://enkpfnqsjjnanlqhjnsv.supabase.co
- **Database Password:** nv6nwoybbncL5rIn
- **Anon Key:**
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua3BmbnFzampuYW5scWhqbnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjcyODAsImV4cCI6MjA3NjE0MzI4MH0.WwYOmV_jXBsrZ74GWw9xuSzRC1vf1k39DAHjY1EI1hE
- **Service Role Key:**
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua3BmbnFzampuYW5scWhqbnN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDU2NzI4MCwiZXhwIjoyMDc2MTQzMjgwfQ.RTUbPMwgLTEayzYN1DITFO1s-Mg_k0vQMb-9QSnF9z4

**Uso:** Ambiente de desenvolvimento onde desenvolvedores fazem alterações e
testes iniciais.

#### Projeto 2 - Teste (insightTest)

- **Project ID:** bosxuteortfshfysoqrd
- **Project URL:** https://bosxuteortfshfysoqrd.supabase.co
- **Database Password:** zNyblIyITMXAGgBJ
- **Anon Key:**
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc3h1dGVvcnRmc2hmeXNvcXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0ODk4MzQsImV4cCI6MjA3NjA2NTgzNH0.-y6cd1ZIfqhtnr12Cf1Fx9guC_1EMtxfHKvwiGV4z2w
- **Service Role Key:**
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc3h1dGVvcnRmc2hmeXNvcXJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ4OTgzNCwiZXhwIjoyMDc2MDY1ODM0fQ.3_6W5Ny2sHW_S38nLByoN53sHJM80XIgvKavr-zbNaU

**Uso:** Ambiente de teste/staging para validação antes de deploy em produção.

---

### Conta Supabase B (rilto.ns@gmail.com)

**Organização:** insightProducao

#### Projeto 1 - Produção (insightProd)

- **Project ID:** jropngieefxgnufmkeaj
- **Project URL:** https://jropngieefxgnufmkeaj.supabase.co
- **Database Password:** dogRyjsEfOYVtd5H
- **Anon Key:**
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyb3BuZ2llZWZ4Z251Zm1rZWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjkyNzAsImV4cCI6MjA3NzEwNTI3MH0.7dFi7kNVRxOla1HycbRZwWvhDfgFQuZoyz_kJBaxF4E
- **Service Role Key:**
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyb3BuZ2llZWZ4Z251Zm1rZWFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTUyOTI3MCwiZXhwIjoyMDc3MTA1MjcwfQ.rK2Mj6vJQQtTOKlo6vVJ635IbK9BPudR9MFMUG2O8iM

**Uso:** Ambiente de produção onde usuários finais acessam o sistema.

#### Projeto 2 - Backup (insightProd-bk)

- **Project ID:** vewrtrnqubvmipfgnxlv
- **Project URL:** https://vewrtrnqubvmipfgnxlv.supabase.co
- **Database Password:** NuEmt9MicyIvE3Oa
- **Anon Key:**
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZld3J0cm5xdWJ2bWlwZmdueGx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1Mjk1MTUsImV4cCI6MjA3NzEwNTUxNX0.1-P3co2YUD8zQ-4oGtvYBUPnzMvdniymTzYS-tH5ib4
- **Service Role Key:**
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZld3J0cm5xdWJ2bWlwZmdueGx2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTUyOTUxNSwiZXhwIjoyMDc3MTA1NTE1fQ.OJDgh8wpaPhz9lEoggyjDXM4SHb0uo9kd-UbDrLqefQ

**Uso:** Projeto dedicado para armazenar backups periódicos do banco de
produção.

---

## Estrutura de Branches GitHub

### Branch: `main` (Produção)

- **Ambiente:** Produção
- **Supabase:** Conta B - Projeto insightProd
- **Deploy:** Manual com aprovação
- **Proteção:** Requer pull request reviews e status checks
- **URL Vercel:** [A ser configurado]

### Branch: `staging` (Teste)

- **Ambiente:** Teste/Staging
- **Supabase:** Conta A - Projeto insightTest
- **Deploy:** Automático via Vercel
- **Proteção:** Requer status checks
- **URL Vercel:** [A ser configurado]

### Branch: `development` (Desenvolvimento)

- **Ambiente:** Desenvolvimento
- **Supabase:** Conta A - Projeto insightDev
- **Deploy:** Automático via Vercel
- **Proteção:** Sem restrições
- **URL Vercel:** [A ser configurado]

---

## Fluxo de Trabalho

```
development → staging → main
    ↓           ↓         ↓
  Auto       Auto     Manual
  Deploy     Deploy   Approval
    ↓           ↓         ↓
insightDev  insightTest  insightProd
                           ↓
                      Backup Auto
                           ↓
                    insightProd-bk
```

---

## Configuração Vercel

### Próximos Passos

1. Conectar projeto Vercel ao repositório GitHub
2. Configurar ambientes no Vercel:
   - **Production:** Branch `main`
   - **Preview:** Branch `staging`
   - **Development:** Branch `development`

3. Adicionar variáveis de ambiente por ambiente (ver seção abaixo)

---

## Variáveis de Ambiente por Ambiente

### Desenvolvimento

```env
NEXT_PUBLIC_SUPABASE_URL=https://enkpfnqsjjnanlqhjnsv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua3BmbnFzampuYW5scWhqbnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NjcyODAsImV4cCI6MjA3NjE0MzI4MH0.WwYOmV_jXBsrZ74GWw9xuSzRC1vf1k39DAHjY1EI1hE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVua3BmbnFzampuYW5scWhqbnN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDU2NzI4MCwiZXhwIjoyMDc2MTQzMjgwfQ.RTUbPMwgLTEayzYN1DITFO1s-Mg_k0vQMb-9QSnF9z4
VITE_ENVIRONMENT=development
```

### Teste

```env
NEXT_PUBLIC_SUPABASE_URL=https://bosxuteortfshfysoqrd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc3h1dGVvcnRmc2hmeXNvcXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0ODk4MzQsImV4cCI6MjA3NjA2NTgzNH0.-y6cd1ZIfqhtnr12Cf1Fx9guC_1EMtxfHKvwiGV4z2w
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvc3h1dGVvcnRmc2hmeXNvcXJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQ4OTgzNCwiZXhwIjoyMDc2MDY1ODM0fQ.3_6W5Ny2sHW_S38nLByoN53sHJM80XIgvKavr-zbNaU
VITE_ENVIRONMENT=test
```

### Produção

```env
NEXT_PUBLIC_SUPABASE_URL=https://jropngieefxgnufmkeaj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyb3BuZ2llZWZ4Z251Zm1rZWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MjkyNzAsImV4cCI6MjA3NzEwNTI3MH0.7dFi7kNVRxOla1HycbRZwWvhDfgFQuZoyz_kJBaxF4E
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyb3BuZ2llZWZ4Z251Zm1rZWFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTUyOTI3MCwiZXhwIjoyMDc3MTA1MjcwfQ.rK2Mj6vJQQtTOKlo6vVJ635IbK9BPudR9MFMUG2O8iM
VITE_ENVIRONMENT=production
```

### Backup (Para GitHub Actions)

```env
BACKUP_SUPABASE_URL=https://vewrtrnqubvmipfgnxlv.supabase.co
BACKUP_SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZld3J0cm5xdWJ2bWlwZmdueGx2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTUyOTUxNSwiZXhwIjoyMDc3MTA1NTE1fQ.OJDgh8wpaPhz9lEoggyjDXM4SHb0uo9kd-UbDrLqefQ
```

---

## Limites do Tier Gratuito Supabase

| Recurso               | Limite por Projeto | Total (4 projetos) |
| --------------------- | ------------------ | ------------------ |
| Armazenamento         | 500 MB             | 2 GB               |
| Largura de Banda      | 2 GB/mês           | 8 GB/mês           |
| Tamanho do Banco      | 500 MB             | 2 GB               |
| Conexões Simultâneas  | 60                 | 240                |
| Requisições API       | Ilimitadas         | Ilimitadas         |
| Pausa por Inatividade | 7 dias             | -                  |

---

## Políticas de Segurança

### Acesso aos Ambientes

| Ambiente        | Desenvolvedores      | Administradores    | Usuários Finais    |
| --------------- | -------------------- | ------------------ | ------------------ |
| Desenvolvimento | ✅ Leitura/Escrita   | ✅ Leitura/Escrita | ❌ Sem acesso      |
| Teste           | ✅ Leitura/Escrita   | ✅ Leitura/Escrita | ❌ Sem acesso      |
| Produção        | ❌ Sem acesso direto | ✅ Leitura/Escrita | ✅ Leitura/Escrita |
| Backup          | ❌ Sem acesso        | ✅ Somente leitura | ❌ Sem acesso      |

### Armazenamento de Credenciais

- **Desenvolvimento/Teste:** `.env.local` (não commitado no Git)
- **Produção:** Vercel Environment Variables (encrypted)
- **Backup:** GitHub Secrets (encrypted)
- **Documentação:** `credenciais/` (adicionado ao .gitignore)

---

## Próximos Passos

### Configuração Vercel

1. [ ] Conectar repositório GitHub ao Vercel
2. [ ] Configurar ambientes (Production, Preview, Development)
3. [ ] Adicionar variáveis de ambiente para cada ambiente
4. [ ] Testar deploys automáticos

### Configuração GitHub

1. [x] Criar branches (development, staging, main)
2. [ ] Configurar branch protection rules
3. [ ] Configurar GitHub Actions para backup
4. [ ] Adicionar secrets necessários

### Documentação

1. [x] Documentar infraestrutura completa
2. [ ] Criar guia de setup para desenvolvedores
3. [ ] Documentar processo de deploy
4. [ ] Criar guia de troubleshooting

---

## Contatos de Emergência

### Administradores

- **Email:** [A ser definido]
- **Slack:** [A ser definido]

### Suporte Técnico

- **Supabase Support:** https://supabase.com/support
- **Vercel Support:** https://vercel.com/support
- **GitHub Support:** https://support.github.com

---

## Histórico de Alterações

| Data       | Versão | Alteração                         | Autor   |
| ---------- | ------ | --------------------------------- | ------- |
| 2025-01-27 | 1.0    | Criação inicial da infraestrutura | Sistema |
| 2025-01-27 | 1.0    | Criação de branches GitHub        | Sistema |

---

## Referências

- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Vercel](https://vercel.com/docs)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Design Document](.kiro/specs/multi-environment-setup/design.md)
- [Requirements Document](.kiro/specs/multi-environment-setup/requirements.md)
