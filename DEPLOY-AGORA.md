# 🚀 Deploy Imediato no Netlify

O build está pronto! A pasta `dist` foi gerada com sucesso.

## ✅ Build concluído

```
dist/
├── index.html
├── manifest.webmanifest
├── test-pwa.html
├── sw.js (Service Worker)
├── workbox-*.js
└── assets/
```

## Opção 1: Deploy via Netlify Drop (Mais rápido - 2 minutos)

1. **Acesse:** https://app.netlify.com/drop

2. **Arraste a pasta `dist`** para a área de drop

3. **Pronto!** O site estará no ar em segundos

4. **Configure domínio customizado** (opcional):
   - Vá em "Site settings" > "Domain management"
   - Adicione seu domínio customizado

## Opção 2: Deploy via Git (Recomendado para produção)

1. **Acesse:** https://app.netlify.com

2. **Clique em:** "Add new site" > "Import an existing project"

3. **Conecte ao GitHub:**
   - Autorize o Netlify
   - Selecione: `sobrinkedos/insightFlow`

4. **Configure o build:**
   ```
   Branch to deploy: main
   Build command: npm run build:no-check
   Publish directory: dist
   ```

5. **Adicione variáveis de ambiente:**
   - Vá em "Site settings" > "Environment variables"
   - Adicione:
     - `VITE_SUPABASE_URL` = sua URL do Supabase
     - `VITE_SUPABASE_ANON_KEY` = sua chave anônima

6. **Deploy!**

## Opção 3: Deploy via CLI (se já estiver logado)

```bash
# Login no Netlify (abre o navegador)
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

## Após o deploy

### 1. Teste o PWA

Acesse: `https://seu-site.netlify.app/test-pwa.html`

Verifique:
- ✅ Service Worker registrado
- ✅ Manifest carregado
- ✅ Web Share Target configurado
- ✅ Instalação disponível

### 2. Instale o PWA

- **Desktop:** Clique no ícone de instalação na barra de endereços
- **Mobile:** Menu > "Adicionar à tela inicial"

### 3. Teste o compartilhamento

1. Abra o YouTube
2. Compartilhe um vídeo
3. Selecione "InsightShare"
4. Verifique se a URL é preenchida automaticamente

## Configurações importantes

### Headers (já configurado no netlify.toml)

```toml
[[headers]]
  for = "/manifest.webmanifest"
  [headers.values]
    Content-Type = "application/manifest+json"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

### Redirects (já configurado)

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Domínio customizado

Se quiser usar `alpha.dualite.dev`:

1. No Netlify: "Site settings" > "Domain management"
2. Clique em "Add custom domain"
3. Digite: `alpha.dualite.dev`
4. Configure DNS:
   - Tipo: CNAME
   - Nome: alpha
   - Valor: [seu-site].netlify.app

## Monitoramento

Após o deploy, monitore:

1. **Lighthouse Score:**
   ```bash
   npx lighthouse https://seu-site.netlify.app --view
   ```

2. **PWA Score:** Deve ser 100

3. **Analytics:** Configure no Netlify

## Troubleshooting

### Build falha no Netlify

Se o build falhar, use o comando sem verificação de tipos:
```
Build command: npm run build:no-check
```

### Service Worker não registra

- Limpe o cache do navegador
- Verifique se está usando HTTPS
- Abra DevTools > Application > Service Workers

### PWA não instala

- Verifique o manifest em `/manifest.webmanifest`
- Certifique-se de que está em HTTPS
- Teste em modo anônimo

## Status atual

✅ Código no GitHub: `sobrinkedos/insightFlow`
✅ Build gerado: pasta `dist` pronta
✅ PWA configurado com Web Share Target
✅ Service Worker gerado automaticamente
✅ Documentação completa

## Próximos passos

1. [ ] Fazer deploy (Opção 1 ou 2)
2. [ ] Testar PWA em `/test-pwa.html`
3. [ ] Instalar PWA
4. [ ] Testar compartilhamento do YouTube
5. [ ] Gerar ícones adequados (opcional)
6. [ ] Configurar domínio customizado (opcional)

---

**Recomendação:** Use a **Opção 1** (Netlify Drop) para deploy imediato, depois configure a **Opção 2** (Git) para deploys automáticos futuros.
