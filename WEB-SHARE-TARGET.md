# Web Share Target API - InsightShare

Este documento explica como funciona o Web Share Target API implementado no InsightShare.

## O que é?

O Web Share Target API permite que seu PWA (Progressive Web App) seja registrado como um destino de compartilhamento no sistema operacional. Isso significa que quando você compartilha um vídeo do YouTube (ou qualquer outro site), o InsightShare aparecerá como uma opção de compartilhamento.

## Como funciona?

### 1. Instalação do PWA

Para que o Web Share Target funcione, o usuário precisa **instalar o PWA**:

#### No Chrome/Edge (Desktop):
1. Acesse o site do InsightShare
2. Clique no ícone de instalação na barra de endereços (ou menu > Instalar InsightShare)
3. Confirme a instalação

#### No Chrome/Edge (Mobile):
1. Acesse o site do InsightShare
2. Toque no menu (⋮) > "Adicionar à tela inicial" ou "Instalar app"
3. Confirme a instalação

#### No Safari (iOS):
1. Acesse o site do InsightShare
2. Toque no botão de compartilhar
3. Role para baixo e toque em "Adicionar à Tela de Início"

### 2. Compartilhando um vídeo

Depois de instalado:

1. Abra o YouTube (app ou web)
2. Clique em "Compartilhar" em qualquer vídeo
3. Selecione "InsightShare" na lista de apps
4. O vídeo será automaticamente adicionado ao InsightShare

### 3. Fluxo técnico

```
YouTube → Compartilhar → InsightShare
                              ↓
                         /share?url=...
                              ↓
                    Usuário logado? 
                    ↙           ↘
                  Sim            Não
                   ↓              ↓
            /videos          /login?returnUrl=...
                   ↓              ↓
        Dialog abre com      Após login → /videos
        URL preenchida       Dialog abre com URL
```

## Arquivos modificados/criados

### Novos arquivos:
- `public/manifest.webmanifest` - Manifest PWA com share_target
- `src/pages/share.tsx` - Página que recebe compartilhamentos
- `WEB-SHARE-TARGET.md` - Esta documentação

### Arquivos modificados:
- `vite.config.ts` - Adicionado plugin PWA
- `index.html` - Adicionado link para manifest
- `src/App.tsx` - Adicionada rota /share
- `src/components/share-video-dialog.tsx` - Lógica para pegar URL do localStorage
- `package.json` - Adicionado vite-plugin-pwa

## Configuração do manifest.webmanifest

```json
{
  "share_target": {
    "action": "/share",
    "method": "GET",
    "enctype": "application/x-www-form-urlencoded",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url"
    }
  }
}
```

Isso diz ao sistema operacional:
- Quando alguém compartilhar algo, envie para `/share`
- Use método GET
- Os parâmetros serão: `title`, `text` e `url`

## Limitações

### Suporte de navegadores:
- ✅ Chrome/Edge (Android) - Suporte completo
- ✅ Chrome/Edge (Desktop) - Suporte completo
- ⚠️ Safari (iOS) - Suporte limitado (precisa adicionar à tela inicial)
- ❌ Firefox - Não suporta Web Share Target API

### Aplicativos nativos:
- O app nativo do YouTube no Android pode compartilhar para PWAs instalados
- O app nativo do YouTube no iOS tem limitações (depende do Safari)

## Testando localmente

1. Build do projeto:
```bash
npm run build
npm run preview
```

2. Acesse via HTTPS (necessário para PWA):
   - Use ngrok ou similar para expor localhost via HTTPS
   - Ou faça deploy em um servidor com HTTPS

3. Instale o PWA

4. Tente compartilhar um vídeo do YouTube

## Alternativas

Se o Web Share Target não funcionar para seu caso de uso:

1. **Extensão do navegador** (já implementada)
2. **Bookmarklet** - Um favorito que executa JavaScript
3. **App nativo** - Para Android/iOS com integração nativa

## Recursos adicionais

- [Web Share Target API - MDN](https://developer.mozilla.org/en-US/docs/Web/Manifest/share_target)
- [PWA Builder](https://www.pwabuilder.com/)
- [Can I Use - Web Share Target](https://caniuse.com/web-share-target)
