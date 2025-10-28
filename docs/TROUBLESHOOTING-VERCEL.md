# 🔧 Troubleshooting - Problemas de Deploy na Vercel

## Problema: Deploy Falha Sem Mostrar Logs

### Causas Comuns:

#### 1. Variáveis de Ambiente Não Configuradas

**Sintoma:** Build falha imediatamente sem logs detalhados

**Solução:**
1. Vá para: Settings → Environment Variables
2. Verifique se TODAS as variáveis necessárias estão configuradas:
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   VITE_ENVIRONMENT
   ```
3. **IMPORTANTE:** Selecione o ambiente correto para cada variável:
   - `Production` → variáveis de produção
   - `Preview` → variáveis de development/staging

#### 2. Comando de Build Incorreto

**Sintoma:** Vercel não encontra o comando de build

**Solução:**
1. Verifique o `vercel.json`:
   ```json
   {
     "buildCommand": "npm run build",
     "installCommand": "npm install"
   }
   ```
2. Ou configure manualmente em Settings → General → Build & Development Settings

#### 3. Node Version Incompatível

**Sintoma:** Erro relacionado a versão do Node

**Solução:**
1. Crie arquivo `.nvmrc` na raiz do projeto:
   ```
   20
   ```
2. Ou configure em Settings → General → Node.js Version

#### 4. Dependências Faltando

**Sintoma:** Erro ao instalar dependências

**Solução:**
1. Verifique se `package-lock.json` está commitado
2. Tente mudar de `npm ci` para `npm install` no vercel.json:
   ```json
   {
     "installCommand": "npm install"
   }
   ```

#### 5. Timeout no Build

**Sintoma:** Build para sem completar

**Solução:**
1. Verifique o plano da Vercel (free tem limite de tempo)
2. Otimize o build:
   - Remova dependências não usadas
   - Use `npm ci` ao invés de `npm install`
   - Considere fazer cache de node_modules

#### 6. Projeto Não Conectado ao Git

**Sintoma:** Vercel não detecta pushes

**Solução:**
1. Vá em Settings → Git
2. Verifique se o repositório está conectado
3. Se não estiver, reconecte:
   - Disconnect
   - Connect Git Repository
   - Selecione o repositório novamente

---

## Como Ver Logs Detalhados

### Método 1: Via Dashboard

1. Acesse o deployment que falhou
2. Clique na aba **Building**
3. Expanda cada step para ver logs completos
4. Procure por mensagens de erro em vermelho

### Método 2: Via CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Ver logs do último deployment
vercel logs

# Ver logs de um deployment específico
vercel logs [deployment-url]
```

### Método 3: Forçar Logs Verbosos

Adicione ao `vercel.json`:
```json
{
  "buildCommand": "npm run build --verbose"
}
```

---

## Checklist de Verificação

Quando o deploy falhar, verifique:

- [ ] **Variáveis de ambiente configuradas?**
  - Settings → Environment Variables
  - Todas as variáveis `VITE_*` estão lá?
  - Ambiente correto selecionado (Production/Preview)?

- [ ] **Build funciona localmente?**
  ```bash
  npm install
  npm run build
  ```

- [ ] **Repositório conectado?**
  - Settings → Git
  - Connected Git Repository está correto?

- [ ] **Branch correta?**
  - Deployments → Ver qual branch foi usada
  - Production Branch está configurada como `main`?

- [ ] **Arquivos necessários commitados?**
  - `package.json` ✅
  - `package-lock.json` ✅
  - `vite.config.ts` ✅
  - `index.html` ✅

- [ ] **Vercel.json está correto?**
  - `buildCommand` correto?
  - `outputDirectory` é `dist`?
  - `framework` é `vite`?

---

## Soluções Rápidas

### Solução 1: Redeploy Limpo

1. No dashboard, vá em Deployments
2. Clique nos 3 pontos do deployment
3. Selecione **Redeploy**
4. Marque **Use existing Build Cache** = OFF
5. Clique em **Redeploy**

### Solução 2: Reconectar Repositório

1. Settings → Git
2. Clique em **Disconnect**
3. Clique em **Connect Git Repository**
4. Selecione o repositório novamente
5. Autorize as permissões

### Solução 3: Configuração Manual

1. Settings → General
2. Em **Build & Development Settings**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. Salve e faça redeploy

### Solução 4: Verificar Limites do Plano

Se você está no plano gratuito:
- Build timeout: 45 segundos
- Bandwidth: 100GB/mês
- Deployments: Ilimitados

Se o build demora mais de 45s, considere:
- Otimizar dependências
- Upgrade para plano Pro

---

## Teste de Build Local

Antes de fazer deploy, sempre teste localmente:

```bash
# Limpar cache
rm -rf node_modules dist

# Instalar dependências
npm install

# Testar build
npm run build

# Testar preview
npm run preview
```

Se funcionar localmente mas falhar na Vercel, o problema é de configuração da Vercel.

---

## Contato com Suporte

Se nada funcionar:

1. **Vercel Support:**
   - https://vercel.com/support
   - Inclua: URL do deployment, logs, screenshots

2. **Vercel Community:**
   - https://github.com/vercel/vercel/discussions

3. **Stack Overflow:**
   - Tag: `vercel` + `vite`

---

## Configuração Recomendada

Para evitar problemas, use esta configuração:

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**.nvmrc:**
```
20
```

**package.json:**
```json
{
  "scripts": {
    "build": "vite build"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

**Última atualização:** 2025-01-28
