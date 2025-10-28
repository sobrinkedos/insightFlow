# 🧪 Verificação de Deploy - Branch Development

Este arquivo foi criado para testar o deploy automático na branch `development`.

## Informações do Teste

- **Data:** 2025-01-28
- **Branch:** development
- **Objetivo:** Verificar se a Vercel detecta mudanças e faz deploy automático

## O Que Deve Acontecer

Quando este arquivo for commitado e enviado para `origin/development`:

1. ✅ GitHub recebe o push
2. ✅ Vercel detecta a mudança automaticamente
3. ✅ Vercel inicia um **Preview Deployment**
4. ✅ URL de preview é gerada (formato: `https://projeto-git-development-user.vercel.app`)

## Como Verificar no Dashboard da Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto: **insight-flow** (ou nome que você deu)
3. Clique na aba **Deployments** (menu superior)
4. Procure por um deployment com:
   - **Branch:** `development`
   - **Status:** Building → Ready
   - **Type:** Preview (ícone de olho 👁️)
   - **Commit:** "test: verificar deploy automático na branch development"

## URLs Esperadas

Após o deploy, você terá:

- **Preview URL:** `https://insight-flow-git-development-[seu-user].vercel.app`
- **Unique URL:** `https://insight-flow-[hash-unico].vercel.app`

## Checklist de Verificação

- [ ] Push foi feito com sucesso para `origin/development`
- [ ] Vercel detectou o push (veja em Deployments)
- [ ] Build iniciou automaticamente
- [ ] Build completou com sucesso
- [ ] Preview URL está acessível
- [ ] Variáveis de ambiente corretas (development)

## Próximos Passos

Depois de verificar que funciona:
1. ✅ Testar branch `staging`
2. ✅ Testar branch `main` (produção)
3. ✅ Verificar variáveis de ambiente por branch
4. ✅ Configurar GitHub Actions para produção

## Troubleshooting

### Se o deploy não iniciar:

1. **Verifique a conexão Git:**
   - Vá em Settings → Git
   - Confirme que o repositório está conectado

2. **Verifique se o projeto está pausado:**
   - No dashboard, veja se há aviso de projeto pausado

3. **Force um redeploy:**
   - Na aba Deployments, clique nos 3 pontos do último deploy
   - Selecione "Redeploy"

### Se o build falhar:

1. **Veja os logs:**
   - Clique no deployment que falhou
   - Veja a aba "Building"
   - Identifique o erro

2. **Teste localmente:**
   ```bash
   npm run build
   ```

3. **Verifique variáveis de ambiente:**
   - Settings → Environment Variables
   - Confirme que todas as variáveis necessárias estão configuradas

---

**Status:** 🟡 Aguardando deploy...

**Atualização:** Será atualizado após verificação do deploy.
