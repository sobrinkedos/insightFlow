# Atualização dos Pacotes de Extensão

## ✅ Problema Resolvido

Os arquivos ZIP das extensões disponíveis para download no aplicativo estavam incompletos ou desatualizados. Agora temos um script automatizado que gera os pacotes corretos.

## 📦 Pacotes Gerados

Os seguintes arquivos foram atualizados em `public/downloads/`:

1. **insightshare-chrome.zip** (32.18 KB)
   - Manifest V3 para Chrome
   - Todos os arquivos necessários

2. **insightshare-edge.zip** (32.23 KB)
   - Manifest específico para Edge
   - Otimizado para Windows 11

3. **insightshare-firefox.zip** (36.22 KB)
   - Manifest V2 para Firefox
   - Arquivos específicos do Firefox (background-firefox.js, popup-firefox.html)

## 🔧 Script de Build

Criado o script `scripts/build-extension-packages.ps1` que:

### Funcionalidades

1. **Remove pacotes antigos** automaticamente
2. **Copia arquivos comuns** para todas as extensões:
   - background.js
   - content.js
   - content.css
   - popup.html
   - popup.js
   - config.js
   - Ícones (16x16, 32x32, 48x48, 128x128)

3. **Adiciona manifests específicos** para cada navegador
4. **Inclui arquivos específicos** do Firefox quando necessário
5. **Gera ZIPs otimizados** prontos para instalação

### Como Usar

```powershell
# Execute na raiz do projeto
.\scripts\build-extension-packages.ps1
```

### Saída Esperada

```
Construindo pacotes de extensao...

Removendo pacotes antigos...
Criando pacote para chrome...
  OK: insightshare-chrome.zip criado (32.18 KB)
Criando pacote para edge...
  OK: insightshare-edge.zip criado (32.23 KB)
Criando pacote para firefox...
  OK: insightshare-firefox.zip criado (36.22 KB)

Todos os pacotes foram criados com sucesso!
```

## 📁 Estrutura dos Pacotes

### Chrome/Edge
```
insightshare-chrome.zip
├── manifest.json
├── background.js
├── content.js
├── content.css
├── popup.html
├── popup.js
├── config.js
├── icon16.png
├── icon32.png
├── icon48.png
└── icon128.png
```

### Firefox
```
insightshare-firefox.zip
├── manifest.json (manifest-firefox.json renomeado)
├── background.js
├── background-firefox.js
├── content.js
├── content.css
├── popup.html
├── popup-firefox.html
├── popup.js
├── popup-firefox.js
├── config.js
├── icon16.png
├── icon32.png
├── icon48.png
└── icon128.png
```

## 🚀 Deploy

Após executar o script e fazer commit:

```bash
git add public/downloads/*.zip scripts/build-extension-packages.ps1
git commit -m "feat: atualiza pacotes de extensão"
git push
```

O Vercel fará deploy automático e os novos pacotes estarão disponíveis para download em:
- https://seu-dominio.vercel.app/downloads/insightshare-chrome.zip
- https://seu-dominio.vercel.app/downloads/insightshare-edge.zip
- https://seu-dominio.vercel.app/downloads/insightshare-firefox.zip

## 🔄 Quando Atualizar

Execute o script sempre que:
- Modificar arquivos da extensão (background.js, content.js, popup.js, etc.)
- Atualizar manifests
- Adicionar novos recursos
- Corrigir bugs
- Atualizar ícones

## ✅ Verificação

Para verificar se os pacotes estão corretos:

1. **Baixe o ZIP** do aplicativo
2. **Extraia os arquivos**
3. **Verifique se contém**:
   - Todos os arquivos listados acima
   - Manifest.json válido
   - Ícones em todos os tamanhos
   - Scripts funcionais

4. **Teste a instalação**:
   - Chrome: `chrome://extensions/` → "Carregar sem compactação"
   - Edge: `edge://extensions/` → "Carregar sem compactação"
   - Firefox: `about:debugging` → "Carregar extensão temporária"

## 🐛 Troubleshooting

### Erro: "Couldn't load icon icons/icon16.png"
- Verifique se os ícones foram copiados corretamente
- Execute o script novamente

### Pacote muito pequeno (< 20 KB)
- Arquivos podem estar faltando
- Verifique a lista de arquivos comuns no script

### Manifest inválido
- Verifique se o manifest correto foi copiado
- Chrome/Edge: manifest.json ou manifest-edge.json
- Firefox: manifest-firefox.json

## 📝 Notas

- Os pacotes são gerados em `public/downloads/`
- Arquivos temporários são criados e removidos automaticamente
- O script é idempotente (pode ser executado múltiplas vezes)
- Tamanhos dos arquivos são exibidos após a criação

## 🎯 Próximos Passos

1. ✅ Script de build criado
2. ✅ Pacotes atualizados
3. ✅ Commit e push realizados
4. ⏳ Aguardar deploy do Vercel
5. ✅ Testar downloads no aplicativo
