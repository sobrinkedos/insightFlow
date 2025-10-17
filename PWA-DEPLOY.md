# Guia de Deploy - PWA com Web Share Target

## Pré-requisitos

Para que o PWA funcione corretamente, você precisa:

1. ✅ **HTTPS obrigatório** - PWAs só funcionam em conexões seguras
2. ✅ **Service Worker registrado** - Gerado automaticamente pelo vite-plugin-pwa
3. ✅ **Manifest válido** - Já configurado em `public/manifest.webmanifest`

## Checklist antes do deploy

- [ ] Build do projeto executado com sucesso
- [ ] Manifest acessível em `/manifest.webmanifest`
- [ ] Service Worker gerado (verifique em `dist/sw.js` após build)
- [ ] HTTPS configurado no servidor
- [ ] Ícones do PWA criados (veja `public/GENERATE-ICONS.md`)

## Deploy no Netlify (Recomendado)

O projeto já está configurado com `netlify.toml`. Para fazer deploy:

```bash
# 1. Build do projeto
npm run build

# 2. Deploy (se tiver Netlify CLI instalado)
netlify deploy --prod

# Ou faça deploy via interface do Netlify
```

### Configurações importantes no Netlify:

No arquivo `netlify.toml`, certifique-se de ter:

```toml
[[headers]]
  for = "/manifest.webmanifest"
  [headers.values]
    Content-Type = "application/manifest+json"
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Content-Type = "application/javascript"
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

## Deploy no Vercel

```bash
# 1. Build do projeto
npm run build

# 2. Deploy
vercel --prod
```

Adicione em `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/manifest.webmanifest",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/manifest+json"
        }
      ]
    },
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

## Testando o PWA após deploy

1. Acesse: `https://seu-dominio.com/test-pwa.html`
2. Verifique todos os itens da checklist
3. Tente instalar o PWA
4. Teste o compartilhamento

### Teste manual de compartilhamento:

1. Instale o PWA no seu dispositivo
2. Abra o YouTube
3. Clique em "Compartilhar" em um vídeo
4. Procure por "InsightShare" na lista
5. Selecione e verifique se a URL é preenchida

## Troubleshooting

### PWA não aparece para instalação

**Problema:** O navegador não oferece a opção de instalar.

**Soluções:**
- Verifique se está usando HTTPS
- Abra DevTools > Application > Manifest e veja se há erros
- Verifique se o service worker está registrado
- Limpe o cache e recarregue a página

### Service Worker não registra

**Problema:** Service worker não aparece em DevTools > Application > Service Workers.

**Soluções:**
- Verifique se fez o build (`npm run build`)
- Certifique-se de que está testando a versão de produção
- Verifique se há erros no console
- Tente em modo anônimo

### Web Share Target não funciona

**Problema:** InsightShare não aparece na lista de compartilhamento.

**Soluções:**
- Certifique-se de que o PWA está **instalado**
- Verifique se o navegador suporta Web Share Target (Chrome/Edge)
- No Android, pode levar alguns minutos após a instalação
- Reinicie o navegador após instalar o PWA

### Manifest não carrega

**Problema:** Erro 404 ao acessar `/manifest.webmanifest`.

**Soluções:**
- Verifique se o arquivo está em `public/manifest.webmanifest`
- Certifique-se de que o build copiou o arquivo para `dist/`
- Verifique as configurações do servidor

## Monitoramento

Após o deploy, monitore:

1. **Lighthouse Score** - Deve ter 100 em PWA
   ```bash
   npm install -g lighthouse
   lighthouse https://seu-dominio.com --view
   ```

2. **Service Worker Status** - DevTools > Application > Service Workers

3. **Manifest Validation** - DevTools > Application > Manifest

4. **Console Errors** - Verifique se há erros relacionados ao PWA

## Atualizações

Quando fizer atualizações no PWA:

1. Incremente a versão no `package.json`
2. Faça o build e deploy
3. O service worker detectará automaticamente a atualização
4. Usuários verão uma notificação para recarregar (se configurado)

## Recursos úteis

- [PWA Builder](https://www.pwabuilder.com/) - Validar e testar PWA
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Auditoria de PWA
- [Maskable.app](https://maskable.app/) - Testar ícones maskable
- [Web.dev PWA Checklist](https://web.dev/pwa-checklist/) - Checklist completa

## Suporte por plataforma

| Plataforma | Web Share Target | Instalação | Notas |
|------------|------------------|------------|-------|
| Chrome Android | ✅ | ✅ | Suporte completo |
| Chrome Desktop | ✅ | ✅ | Suporte completo |
| Edge Android | ✅ | ✅ | Suporte completo |
| Edge Desktop | ✅ | ✅ | Suporte completo |
| Safari iOS | ⚠️ | ⚠️ | Limitado, precisa "Adicionar à Tela Inicial" |
| Safari macOS | ⚠️ | ⚠️ | Suporte limitado |
| Firefox | ❌ | ⚠️ | Não suporta Web Share Target |

## Próximos passos

1. [ ] Gerar ícones adequados (veja `public/GENERATE-ICONS.md`)
2. [ ] Testar em diferentes dispositivos
3. [ ] Configurar notificações push (opcional)
4. [ ] Adicionar offline support (já configurado pelo vite-plugin-pwa)
5. [ ] Monitorar analytics de instalação do PWA
