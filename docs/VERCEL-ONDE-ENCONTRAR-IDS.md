# 🔍 Onde Encontrar os IDs da Vercel

## Guia Visual Passo a Passo

### 1️⃣ VERCEL_TOKEN (Token de Acesso)

**Onde:** https://vercel.com/account/tokens

**Passos:**
1. Clique no seu **avatar** no canto superior direito
2. Selecione **Settings**
3. Na barra lateral, clique em **Tokens**
4. Clique no botão **Create Token**
5. Preencha:
   - **Token Name:** `GitHub Actions Deploy`
   - **Scope:** `Full Account` (ou selecione o projeto específico)
   - **Expiration:** `No Expiration` (ou escolha um período)
6. Clique em **Create Token**
7. **COPIE O TOKEN IMEDIATAMENTE** (ele só aparece uma vez!)

**Formato do token:**
```
vercel_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### 2️⃣ VERCEL_ORG_ID (Organization/Team ID)

**Onde:** Settings da sua conta

**Passos:**

#### Opção A: Via Dashboard
1. Clique no seu **avatar/nome** no canto superior direito
2. Selecione **Settings**
3. Na barra lateral, clique em **General**
4. Procure pela seção **Your ID** ou **Team ID**
5. Copie o valor

**Formato:**
```
team_xxxxxxxxxxxxxxxxxxxxx    (se você tem um team)
user_xxxxxxxxxxxxxxxxxxxxx    (se é conta pessoal)
```

#### Opção B: Via CLI (Mais Fácil)
```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Linkar projeto (cria arquivo com IDs)
cd seu-projeto
vercel link

# Ver os IDs
cat .vercel/project.json
```

O arquivo `.vercel/project.json` terá:
```json
{
  "orgId": "team_xxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxx"
}
```

---

### 3️⃣ VERCEL_PROJECT_ID (Project ID)

**Onde:** Settings do projeto

**Passos:**
1. No **dashboard da Vercel**, selecione seu projeto
2. Clique em **Settings** na barra lateral esquerda
3. Certifique-se de estar na aba **General** (primeira aba)
4. **Role a página para baixo**
5. Procure pela seção **Project ID**
6. Copie o valor

**Formato:**
```
prj_xxxxxxxxxxxxxxxxxxxxx
```

**Dica:** O Project ID geralmente está no final da página de Settings → General.

---

## 📋 Checklist Rápido

Depois de obter os valores, você deve ter:

```bash
✅ VERCEL_TOKEN=vercel_abc123...
✅ VERCEL_ORG_ID=team_xyz789... (ou user_xyz789...)
✅ VERCEL_PROJECT_ID=prj_def456...
```

---

## 🚨 Problemas Comuns

### "Não encontro o Organization ID"

**Solução 1:** Use a CLI
```bash
vercel whoami
# Mostra seu username

vercel link
# Cria .vercel/project.json com os IDs
```

**Solução 2:** Verifique a URL
- Quando você está no dashboard, a URL é:
  ```
  https://vercel.com/[seu-username-ou-team]/[projeto]
  ```
- O `[seu-username-ou-team]` é uma pista, mas você precisa do ID real nas Settings

### "Não encontro o Project ID"

**Solução 1:** Use a CLI (mais confiável)
```bash
cd seu-projeto
vercel link
cat .vercel/project.json
```

**Solução 2:** Crie o projeto primeiro
- Se você ainda não fez o primeiro deploy, o Project ID pode não existir
- Faça um deploy manual primeiro:
  ```bash
  vercel
  ```

### "Meu token não funciona"

**Causas comuns:**
1. Token copiado incorretamente (espaços extras)
2. Token expirado
3. Scope insuficiente (precisa ser Full Account ou ter acesso ao projeto)

**Solução:**
- Crie um novo token
- Certifique-se de copiar completamente
- Use scope **Full Account**

---

## 🎯 Próximos Passos

Depois de obter os IDs:

1. **Adicione aos GitHub Secrets:**
   - Vá para: `https://github.com/seu-usuario/seu-repo/settings/secrets/actions`
   - Adicione cada um como um secret separado

2. **Configure as variáveis de ambiente no Vercel:**
   - Vá para: Settings → Environment Variables
   - Adicione as variáveis do Supabase

3. **Teste o deploy:**
   ```bash
   git push origin development
   ```

---

## 📚 Referências

- [Vercel Tokens Documentation](https://vercel.com/docs/rest-api#authentication)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [GitHub Actions with Vercel](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel)

---

**Última atualização:** 2025-01-28
