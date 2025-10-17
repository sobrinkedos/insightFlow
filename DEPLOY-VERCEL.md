# 🚀 Deploy na Vercel - InsightShare PWA

## Configuração completa

O projeto está configurado para deploy na Vercel com suporte total ao PWA.

## Opção 1: Deploy via Interface (RECOMENDADO - 2 minutos)

### Passo a passo:

1. **Acesse:** https://vercel.com/new

2. **Importe o repositório:**
   - Clique em "Import Git Repository"
   - Conecte ao GitHub (se ainda não conectou)
   - Selecione: `sobrinkedos/insightFlow`

3. **Configure o projeto:**
   - **Project Name:** `insightshare` (ou o nome que preferir)
   - **Framework Preset:** Vite (detectado automaticamente)
   - **Build Command:** `npm run build:no-check`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Adicione variáveis de ambiente:**
   - Clique em "Environment Variables"
   - Adicione:
     - `VITE_SUPABASE_URL` = sua URL do Supabase
     - `VITE_SUPABASE_ANON_KEY` = sua chave anônima

5. **Clique em "Deploy"**

6. **Aguarde ~2 minutos** e pronto! 🎉

## Opção 2: Deploy via CLI

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod
```

## Opção 3: Deploy via Git (Automático)

Depois de conectar o repositório na Vercel:

```bash
# Qualquer push para main faz deploy automático
git add .
git commit -m "update"
git push
```

## Configurações importantes

### vercel.json (já criado)

```json
{
  "buildCommand": "npm run build:no-check",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Headers configurados:

- ✅ Manifest com Content-Type correto
- ✅ Service Worker com cache adequado
- ✅ Headers de segurança (XSS, Frame, etc)
- ✅ Rewrites para SPA

### Domínio customizado

Após o deploy, configure domínio customizado:

1. No dashboard da Vercel, vá em "Settings" > "Domains"
2. Adicione: `alpha.dualite.dev`
3. Configure DNS:
   - Tipo: CNAME
   - Nome: alpha
   - Valor: cname.vercel-dns.com

## Após o deploy

### 1. Teste o PWA

Acesse: `https://seu-projeto.vercel.app/test-pwa.html`

Verifique:
- ✅ Service Worker registrado
- ✅ Manifest carregado
- ✅ Web Share Target configurado
- ✅ Instalação disponível

### 2. Instale o PWA

- **Desktop:** Clique no ícone de instalação
- **Mobile:** Menu > "Adicionar à tela inicial"

### 3. Teste compartilhamento

1. Abra YouTube
2. Compartilhe um vídeo
3. Selecione "InsightShare"
4. URL preenchida automaticamente!

## Vantagens da Vercel

✅ Deploy em ~2 minutos
✅ HTTPS automático
✅ CDN global
✅ Preview de branches
✅ Rollback fácil
✅ Analytics integrado
✅ Domínio customizado grátis

## Monitoramento

### Lighthouse Score

```bash
npx lighthouse https://seu-projeto.vercel.app --view
```

### Vercel Analytics

Ative em: Dashboard > Analytics

### Web Vitals

A Vercel monitora automaticamente:
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)

## Troubleshooting

### Build falha

Se o build falhar, verifique:
1. Comando de build: `npm run build:no-check`
2. Output directory: `dist`
3. Node version: 18 ou superior

### Service Worker não registra

1. Limpe cache do navegador
2. Verifique HTTPS
3. Abra DevTools > Application > Service Workers

### PWA não instala

1. Verifique manifest em `/manifest.webmanifest`
2. Certifique-se de estar em HTTPS
3. Teste em modo anônimo

## Comparação: Vercel vs Netlify

| Feature | Vercel | Netlify |
|---------|--------|---------|
| Deploy speed | ⚡ Muito rápido | ⚡ Rápido |
| CDN | ✅ Global | ✅ Global |
| HTTPS | ✅ Automático | ✅ Automático |
| Preview | ✅ Sim | ✅ Sim |
| Analytics | ✅ Integrado | ⚠️ Pago |
| Edge Functions | ✅ Sim | ✅ Sim |
| Preço Free | ✅ Generoso | ✅ Generoso |

## Próximos passos

1. [ ] Deploy na Vercel
2. [ ] Testar PWA em `/test-pwa.html`
3. [ ] Instalar PWA
4. [ ] Testar compartilhamento
5. [ ] Configurar domínio customizado
6. [ ] Ativar Analytics

## URLs úteis

- **Dashboard:** https://vercel.com/dashboard
- **Documentação:** https://vercel.com/docs
- **Status:** https://vercel-status.com

---

**Recomendação:** Use a **Opção 1** (Interface) para o primeiro deploy. É mais visual e fácil de configurar! 🚀
