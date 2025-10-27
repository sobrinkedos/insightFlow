# Guia Passo a Passo: Configurar GitHub Secrets

## 📋 Visão Geral

Este guia detalha **EXATAMENTE** como configurar os secrets necessários para o sistema de backup automático funcionar.

**Tempo estimado:** 10-15 minutos  
**Dificuldade:** Fácil  
**Pré-requisitos:** Acesso ao repositório GitHub e aos dashboards do Supabase

---

## 🎯 O Que Vamos Fazer

Vamos adicionar 2 secrets no GitHub:
1. `PROD_SUPABASE_DB_URL` - Conexão com banco de produção
2. `BACKUP_SUPABASE_DB_URL` - Conexão com banco de backup

---

## 📝 Parte 1: Obter URL do Banco de Produção

### Passo 1.1: Acessar Dashboard do Supabase (Produção)

1. Abra seu navegador
2. Acesse: https://supabase.com/dashboard
3. Faça login com a conta: **rilto.ns@gmail.com**
4. Você verá a lista de projetos

### Passo 1.2: Selecionar Projeto de Produção

1. Clique no projeto **insightProd**
2. Ou acesse diretamente: https://supabase.com/dashboard/project/jropngieefxgnufmkeaj

### Passo 1.3: Acessar Configurações do Banco

1. No menu lateral esquerdo, clique em **⚙️ Settings** (ícone de engrenagem)
2. No submenu que aparece, clique em **Database**
3. Role a página para baixo até encontrar a seção **Connection string**

### Passo 1.4: Copiar Connection String

1. Na seção **Connection string**, você verá várias abas
2. Clique na aba **URI** (não use Session mode ou Transaction mode)
3. Você verá algo assim:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.jropngieefxgnufmkeaj.supabase.co:5432/postgres
   ```
4. Clique no botão **📋 Copy** ao lado da string

### Passo 1.5: Substituir a Senha

A string copiada tem `[YOUR-PASSWORD]` que precisa ser substituído.

1. Abra um editor de texto (Notepad, VS Code, etc.)
2. Cole a string copiada
3. Substitua `[YOUR-PASSWORD]` por: **dogRyjsEfOYVtd5H**
4. A string final deve ficar assim:
   ```
   postgresql://postgres:dogRyjsEfOYVtd5H@db.jropngieefxgnufmkeaj.supabase.co:5432/postgres
   ```
5. **IMPORTANTE:** Copie esta string completa (Ctrl+A, Ctrl+C)

✅ **Checkpoint:** Você deve ter uma string começando com `postgresql://postgres:dogRyjsEfOYVtd5H@db.jropngieefxgnufmkeaj...`

---

## 📝 Parte 2: Obter URL do Banco de Backup

### Passo 2.1: Acessar Projeto de Backup

1. Volte para https://supabase.com/dashboard
2. Clique no projeto **insightProd-bk**
3. Ou acesse diretamente: https://supabase.com/dashboard/project/vewrtrnqubvmipfgnxlv

### Passo 2.2: Acessar Configurações do Banco

1. No menu lateral esquerdo, clique em **⚙️ Settings**
2. Clique em **Database**
3. Role até **Connection string**

### Passo 2.3: Copiar Connection String

1. Clique na aba **URI**
2. Clique no botão **📋 Copy**

### Passo 2.4: Substituir a Senha

1. Cole a string em um editor de texto
2. Substitua `[YOUR-PASSWORD]` por: **NuEmt9MicyIvE3Oa**
3. A string final deve ficar assim:
   ```
   postgresql://postgres:NuEmt9MicyIvE3Oa@db.vewrtrnqubvmipfgnxlv.supabase.co:5432/postgres
   ```
4. Copie esta string completa

✅ **Checkpoint:** Você deve ter uma string começando com `postgresql://postgres:NuEmt9MicyIvE3Oa@db.vewrtrnqubvmipfgnxlv...`

---

## 📝 Parte 3: Adicionar Secrets no GitHub

### Passo 3.1: Acessar Repositório no GitHub

1. Abra: https://github.com/sobrinkedos/insightFlow
2. Certifique-se de estar logado na sua conta GitHub

### Passo 3.2: Acessar Settings

1. Na página do repositório, procure as abas no topo:
   ```
   < > Code    Issues    Pull requests    Actions    Projects    Wiki    Security    Insights    Settings
   ```
2. Clique na aba **Settings** (última aba à direita)

⚠️ **Nota:** Se você não vê a aba Settings, você não tem permissão de administrador no repositório.

### Passo 3.3: Acessar Secrets and Variables

1. No menu lateral esquerdo, procure a seção **Security**
2. Clique em **Secrets and variables**
3. Um submenu aparecerá
4. Clique em **Actions**

Você verá a página "Actions secrets and variables"

### Passo 3.4: Adicionar Primeiro Secret (Produção)

1. Clique no botão verde **New repository secret** (canto superior direito)
2. Uma página com um formulário aparecerá

**Preencha o formulário:**

**Campo "Name":**
```
PROD_SUPABASE_DB_URL
```
⚠️ **IMPORTANTE:** Digite exatamente assim, em MAIÚSCULAS, sem espaços

**Campo "Secret":**
- Cole a string de conexão do banco de PRODUÇÃO que você preparou na Parte 1
- Deve começar com: `postgresql://postgres:dogRyjsEfOYVtd5H@db.jropngieefxgnufmkeaj...`

**Verificação:**
- ✅ Name está correto: `PROD_SUPABASE_DB_URL`
- ✅ Secret começa com `postgresql://postgres:dogRyjsEfOYVtd5H`
- ✅ Não há espaços extras no início ou fim

3. Clique no botão verde **Add secret**

✅ **Sucesso!** Você verá uma mensagem verde: "Secret PROD_SUPABASE_DB_URL was added"

### Passo 3.5: Adicionar Segundo Secret (Backup)

1. Clique novamente em **New repository secret**

**Preencha o formulário:**

**Campo "Name":**
```
BACKUP_SUPABASE_DB_URL
```

**Campo "Secret":**
- Cole a string de conexão do banco de BACKUP que você preparou na Parte 2
- Deve começar com: `postgresql://postgres:NuEmt9MicyIvE3Oa@db.vewrtrnqubvmipfgnxlv...`

**Verificação:**
- ✅ Name está correto: `BACKUP_SUPABASE_DB_URL`
- ✅ Secret começa com `postgresql://postgres:NuEmt9MicyIvE3Oa`
- ✅ Não há espaços extras

3. Clique em **Add secret**

✅ **Sucesso!** Você verá: "Secret BACKUP_SUPABASE_DB_URL was added"

---

## ✅ Parte 4: Verificar Configuração

### Passo 4.1: Confirmar Secrets Adicionados

Na página "Actions secrets and variables", você deve ver:

```
Repository secrets

BACKUP_SUPABASE_DB_URL          Updated now by [seu-usuario]
PROD_SUPABASE_DB_URL            Updated now by [seu-usuario]
```

✅ **Perfeito!** Se você vê os 2 secrets listados, está tudo certo!

### Passo 4.2: Testar o Workflow

Agora vamos testar se o backup funciona:

1. No repositório, clique na aba **Actions** (no topo)
2. No menu lateral esquerdo, clique em **Backup Produção**
3. Você verá um botão **Run workflow** (à direita)
4. Clique em **Run workflow**
5. Um dropdown aparecerá:
   - Branch: **main** (deixe como está)
   - Tipo de backup: **manual** (deixe como está)
6. Clique no botão verde **Run workflow**

### Passo 4.3: Acompanhar Execução

1. Aguarde alguns segundos
2. A página será atualizada automaticamente
3. Você verá um novo workflow em execução com um ícone amarelo 🟡
4. Clique no nome do workflow para ver os detalhes
5. Clique em **Backup do Banco de Produção** para ver os logs

**O que você deve ver:**
- ✅ Checkout código
- ✅ Setup Node.js
- ✅ Instalar dependências
- ✅ Setup PostgreSQL Client
- ✅ Exportar banco de produção
- ✅ Importar para banco de backup
- ✅ Verificar integridade
- ✅ Registrar backup no histórico

**Tempo esperado:** 2-5 minutos

### Passo 4.4: Verificar Sucesso

Se tudo funcionou:
- ✅ Todos os steps terão um ✓ verde
- ✅ O workflow terá status "Success" com ✓ verde
- ✅ Você verá a mensagem "✨ Backup concluído com sucesso!"

---

## 🎉 Pronto!

**Parabéns!** Você configurou com sucesso os secrets do GitHub!

### O Que Acontece Agora?

1. **Backup Diário Automático:**
   - Todo dia às 2h AM (UTC), o backup será executado automaticamente
   - Você não precisa fazer nada

2. **Backup Manual:**
   - Você pode executar backup a qualquer momento
   - Vá em Actions > Backup Produção > Run workflow

3. **Backup Pós-Migração:**
   - Quando você executar migrações em produção
   - O backup será disparado automaticamente

---

## 🔍 Troubleshooting

### Problema: "Secret not found"

**Causa:** Nome do secret está errado

**Solução:**
1. Vá em Settings > Secrets and variables > Actions
2. Verifique se os nomes estão EXATAMENTE assim:
   - `PROD_SUPABASE_DB_URL`
   - `BACKUP_SUPABASE_DB_URL`
3. Se estiver errado, delete e crie novamente

### Problema: "connection refused"

**Causa:** URL de conexão incorreta ou projeto pausado

**Solução:**
1. Verifique se copiou a URL completa
2. Acesse o dashboard do Supabase
3. Confirme que o projeto está ATIVO (não pausado)
4. Se pausado, clique em "Restore project"

### Problema: "authentication failed"

**Causa:** Senha incorreta na URL

**Solução:**
1. Verifique se substituiu `[YOUR-PASSWORD]` corretamente
2. Senhas corretas:
   - Produção: `dogRyjsEfOYVtd5H`
   - Backup: `NuEmt9MicyIvE3Oa`
3. Delete o secret e crie novamente com a senha correta

### Problema: "permission denied"

**Causa:** Usuário sem permissões

**Solução:**
1. Certifique-se de usar `postgres` como usuário
2. A URL deve começar com `postgresql://postgres:`
3. Verifique no dashboard do Supabase se o usuário postgres existe

### Problema: Workflow não aparece

**Causa:** Arquivo do workflow não está na branch main

**Solução:**
1. Verifique se o arquivo existe: `.github/workflows/backup-production.yml`
2. Certifique-se de estar na branch `main`
3. Faça um commit e push se necessário

---

## 📊 Verificar Backups Realizados

Após o primeiro backup bem-sucedido, você pode verificar:

### Via Supabase Dashboard

1. Acesse o projeto de BACKUP: https://supabase.com/dashboard/project/vewrtrnqubvmipfgnxlv
2. Vá em **Table Editor**
3. Selecione a tabela **backup_history**
4. Você verá os registros de backup

### Via SQL

Execute no banco de backup:

```sql
SELECT 
  timestamp,
  type,
  size_mb,
  status,
  verification_status
FROM public.backup_history
ORDER BY timestamp DESC
LIMIT 5;
```

---

## 🔐 Segurança

### ✅ Boas Práticas

- ✅ Secrets são criptografados pelo GitHub
- ✅ Secrets nunca aparecem nos logs
- ✅ Apenas administradores do repositório podem ver/editar
- ✅ Secrets são injetados apenas durante execução do workflow

### ⚠️ Importante

- ❌ NUNCA commite secrets no código
- ❌ NUNCA compartilhe secrets publicamente
- ❌ NUNCA imprima secrets nos logs
- ✅ Rotacione senhas periodicamente (a cada 30-90 dias)

---

## 📞 Precisa de Ajuda?

Se você seguiu todos os passos e ainda tem problemas:

1. **Verifique os logs do workflow:**
   - Actions > Backup Produção > Clique no workflow > Veja os logs

2. **Verifique a documentação:**
   - `docs/SISTEMA-BACKUP.md` - Documentação completa
   - `docs/CONFIGURAR-GITHUB-SECRETS.md` - Guia técnico

3. **Teste a conexão manualmente:**
   ```bash
   # Instale PostgreSQL client
   # Teste conexão com produção
   psql "postgresql://postgres:dogRyjsEfOYVtd5H@db.jropngieefxgnufmkeaj.supabase.co:5432/postgres" -c "SELECT 1"
   
   # Teste conexão com backup
   psql "postgresql://postgres:NuEmt9MicyIvE3Oa@db.vewrtrnqubvmipfgnxlv.supabase.co:5432/postgres" -c "SELECT 1"
   ```

---

## 📝 Checklist Final

Antes de considerar concluído, verifique:

- [ ] Acessei o dashboard do Supabase (Produção)
- [ ] Copiei a connection string do banco de produção
- [ ] Substituí a senha corretamente (dogRyjsEfOYVtd5H)
- [ ] Acessei o dashboard do Supabase (Backup)
- [ ] Copiei a connection string do banco de backup
- [ ] Substituí a senha corretamente (NuEmt9MicyIvE3Oa)
- [ ] Acessei Settings do repositório no GitHub
- [ ] Fui em Secrets and variables > Actions
- [ ] Adicionei secret PROD_SUPABASE_DB_URL
- [ ] Adicionei secret BACKUP_SUPABASE_DB_URL
- [ ] Executei workflow manualmente para testar
- [ ] Workflow executou com sucesso (✓ verde)
- [ ] Verifiquei registro na tabela backup_history

✅ **Se todos os itens estão marcados, você está pronto!**

---

**Última atualização:** 2025-01-27  
**Versão:** 1.0  
**Autor:** Sistema Kiro
