# Como gerar ícones para o PWA

O PWA precisa de ícones em diferentes tamanhos. Atualmente estamos usando um ícone hospedado externamente, mas o ideal é ter ícones locais.

## Tamanhos necessários:

- 192x192 (obrigatório)
- 512x512 (obrigatório)
- 180x180 (para iOS)
- 32x32 (favicon)
- 16x16 (favicon)

## Opção 1: Usar ferramenta online

1. Acesse: https://www.pwabuilder.com/imageGenerator
2. Faça upload do seu logo/ícone
3. Baixe o pacote de ícones gerado
4. Coloque os arquivos na pasta `public/icons/`

## Opção 2: Usar ferramenta CLI

```bash
npm install -g pwa-asset-generator

# Gerar ícones a partir de uma imagem
pwa-asset-generator logo.png public/icons --icon-only
```

## Opção 3: Manualmente com Photoshop/GIMP/Figma

Crie os seguintes arquivos:
- `public/icons/icon-192x192.png`
- `public/icons/icon-512x512.png`
- `public/icons/apple-touch-icon.png` (180x180)
- `public/favicon.ico` (32x32 e 16x16 combinados)

## Atualizar o manifest

Depois de gerar os ícones, atualize `public/manifest.webmanifest`:

```json
{
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

E adicione no `index.html`:

```html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png">
```

## Nota sobre "maskable"

O atributo `purpose: "any maskable"` permite que o ícone seja adaptado para diferentes formatos (circular, quadrado, etc.) em diferentes dispositivos Android.

Para criar um ícone maskable ideal:
- Use uma área de segurança de 80% no centro
- Os 20% externos podem ser cortados em alguns dispositivos
- Teste em: https://maskable.app/
