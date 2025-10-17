# 🔨 Build das Extensões

## Como Recriar os Pacotes ZIP

### Opção 1: Usando npm (Recomendado)
```bash
npm run build:extensions
```

### Opção 2: Usando Node.js diretamente
```bash
node scripts/build-extensions-simple.js
```

### Opção 3: Manualmente (PowerShell)
```powershell
# Chrome
$temp = "temp-chrome"
New-Item -ItemType Directory -Force -Path $temp | Out-Null
Copy-Item "browser-extension/manifest.json" "$temp/"
Copy-Item "browser-extension/popup.html" "$temp/"
Copy-Item "browser-extension/popup.js" "$temp/"
Copy-Item "browser-extension/content.js" "$temp/"
Copy-Item "browser-extension/content.css" "$temp/"
Copy-Item "browser-extension/background.js" "$temp/"
Copy-Item -Recurse "browser-extension/icons" "$temp/"
Compress-Archive -Path "$temp/*" -DestinationPath "public/downloads/insightshare-chrome.zip" -Force
Remove-Item -Recurse -Force $temp
```

## 📦 Arquivos Gerados

Os arquivos ZIP são criados em `public/downloads/`:
- `insightshare-chrome.zip` - Google Chrome
- `insightshare-edge.zip` - Microsoft Edge  
- `insightshare-firefox.zip` - Mozilla Firefox

## 🔄 Quando Recriar

Recrie os pacotes quando:
- Atualizar o código da extensão
- Adicionar novos recursos
- Corrigir bugs
- Mudar versão no manifest

## 📝 Checklist Antes de Recriar

- [ ] Atualizar versão no manifest.json
- [ ] Testar extensão localmente
- [ ] Verificar se todos os ícones existem
- [ ] Atualizar CHANGELOG
- [ ] Commitar mudanças no git

## 🚀 Deploy

Após recriar:
1. Os arquivos ZIP estarão em `public/downloads/`
2. Faça commit e push
3. Deploy do app (Vercel/Netlify)
4. Os usuários podem baixar da página `/extensions`

## 🐛 Troubleshooting

### Erro: "Compress-Archive não encontrado"
- Certifique-se de estar usando PowerShell (não CMD)
- Ou use `npm run build:extensions`

### Erro: "Arquivo não encontrado"
- Verifique se a pasta `browser-extension` existe
- Verifique se todos os arquivos estão presentes

### ZIP vazio ou incompleto
- Verifique se os ícones foram criados
- Execute `create-icons.html` primeiro
