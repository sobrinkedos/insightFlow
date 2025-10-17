# ⚡ Início Rápido - InsightShare Extension

## 🎯 Em 5 Minutos

### 1️⃣ Criar Ícones (1 min)
```cmd
# Abra no navegador
browser-extension/create-icons.html
# Salve os 4 ícones na pasta icons/
```

### 2️⃣ Escolher Navegador (30 seg)
- **Chrome**: Use arquivos padrão
- **Edge**: Execute `build.cmd` → opção 2
- **Firefox**: Execute `build.cmd` → opção 3

### 3️⃣ Instalar (2 min)
**Chrome/Edge**:
```
1. chrome://extensions/ ou edge://extensions/
2. Ativar "Modo desenvolvedor"
3. "Carregar sem compactação"
4. Selecionar pasta browser-extension
```

**Firefox**:
```
1. about:debugging#/runtime/this-firefox
2. "Carregar extensão temporária"
3. Selecionar manifest.json
```

### 4️⃣ Configurar (1 min)
```
1. Clicar no ícone da extensão
2. URL: https://enkpfnqsjjnanlqhjnsv.supabase.co
3. API Key: [sua chave do .env]
```

### 5️⃣ Testar (30 seg)
```
1. Ir para youtube.com/watch?v=...
2. Clicar no botão 🎬
3. Clicar "Compartilhar Vídeo"
4. ✅ Sucesso!
```

## 📁 Estrutura de Arquivos

```
browser-extension/
├── manifest.json          # Chrome (padrão)
├── manifest-edge.json     # Edge
├── manifest-firefox.json  # Firefox
├── popup.html            # Interface
├── popup.js              # Lógica Chrome/Edge
├── popup-firefox.js      # Lógica Firefox
├── content.js            # Detecta vídeos
├── content.css           # Botão flutuante
├── background.js         # Service worker
├── icons/                # Ícones 16/32/48/128
└── build.cmd             # Build automático
```

## 🔧 Comandos Úteis

### Build para todos navegadores
```cmd
cd browser-extension
build.cmd
# Escolher opção 4
```

### Testar mudanças
```
1. Fazer alterações no código
2. Ir para chrome://extensions/
3. Clicar em "Recarregar" na extensão
4. Testar novamente
```

## 🐛 Problemas Comuns

| Problema | Solução |
|----------|---------|
| Ícones não aparecem | Criar com create-icons.html |
| Extensão não carrega | Verificar manifest.json |
| Botão não aparece | Atualizar página do vídeo |
| Erro ao compartilhar | Verificar API key |

## 📚 Documentação Completa

- [README.md](README.md) - Visão geral
- [INSTALL.md](INSTALL.md) - Chrome
- [INSTALL-EDGE.md](INSTALL-EDGE.md) - Edge
- [INSTALL-FIREFOX.md](INSTALL-FIREFOX.md) - Firefox
- [BROWSERS-COMPARISON.md](BROWSERS-COMPARISON.md) - Comparação
- [PUBLISH.md](PUBLISH.md) - Publicar nas lojas

## 🎉 Pronto!

Agora você pode compartilhar vídeos de qualquer plataforma diretamente com o InsightShare!
