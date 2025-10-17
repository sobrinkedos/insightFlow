# 🚀 Quick Start - PWA Web Share Target

## Comandos rápidos

```bash
# 1. Instalar dependências (se ainda não instalou)
npm install

# 2. Build do projeto
npm run build

# 3. Testar localmente
npm run preview

# 4. Acessar página de teste
# http://localhost:4173/test-pwa.html
```

## Checklist rápido

- [x] ✅ vite-plugin-pwa instalado
- [x] ✅ manifest.webmanifest criado
- [x] ✅ Rota /share configurada
- [x] ✅ Dialog de compartilhamento atualizado
- [x] ✅ Headers do Netlify configurados
- [ ] ⚠️ Ícones do PWA (opcional, mas recomendado)

## Próximos passos

### 1. Gerar ícones (recomendado)

Acesse: https://www.pwabuilder.com/imageGenerator
- Faça upload do logo
- Baixe os ícones
- Coloque em `public/icons/`
- Atualize `public/manifest.webmanifest`

### 2. Deploy

```bash
# Netlify
netlify deploy --prod

# Ou via Git
git add .
git commit -m "feat: add PWA Web Share Target"
git push
```

### 3. Testar em produção

1. Acesse `https://seu-dominio.com/test-pwa.html`
2. Verifique todos os itens
3. Instale o PWA
4. Teste compartilhamento do YouTube

## Como usar (usuário final)

### Desktop (Chrome/Edge):

1. Acesse o site
2. Clique no ícone de instalação na barra de endereços
3. Confirme a instalação
4. Abra YouTube no navegador
5. Clique em "Compartilhar" em um vídeo
6. Selecione "InsightShare"

### Mobile (Android):

1. Acesse o site
2. Menu (⋮) > "Adicionar à tela inicial"
3. Confirme
4. Abra o app do YouTube
5. Compartilhe um vídeo
6. Selecione "InsightShare"

### Mobile (iOS):

1. Acesse o site no Safari
2. Botão de compartilhar
3. "Adicionar à Tela de Início"
4. Abra o YouTube
5. Compartilhe (suporte limitado)

## Troubleshooting rápido

**PWA não instala?**
- Use HTTPS
- Limpe o cache
- Tente modo anônimo

**Compartilhamento não funciona?**
- Instale o PWA primeiro
- Reinicie o navegador
- Verifique se é Chrome/Edge

**Service Worker não registra?**
- Faça o build (`npm run build`)
- Teste a versão de produção
- Verifique o console

## Documentação completa

- `WEB-SHARE-TARGET.md` - Como funciona
- `PWA-DEPLOY.md` - Guia de deploy
- `PWA-IMPLEMENTATION-SUMMARY.md` - Resumo completo
- `public/GENERATE-ICONS.md` - Gerar ícones
- `public/test-pwa.html` - Ferramenta de teste

## Suporte

✅ Chrome/Edge (Android/Desktop)
⚠️ Safari (iOS) - Limitado
❌ Firefox - Não suporta Web Share Target

---

**Pronto!** Seu PWA está configurado e pronto para receber compartilhamentos! 🎉
