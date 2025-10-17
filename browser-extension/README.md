# InsightShare - Extensão de Navegador

Extensão universal para Chrome, Edge e Firefox que permite compartilhar vídeos do YouTube, Instagram, TikTok e outras plataformas diretamente com o InsightShare.

## 🚀 Funcionalidades

- ✅ Detecta automaticamente vídeos em páginas web
- ✅ Botão flutuante para compartilhamento rápido
- ✅ Suporte para múltiplas plataformas:
  - YouTube
  - Instagram
  - TikTok
  - Vimeo
  - Dailymotion
- ✅ Integração direta com a API do InsightShare
- ✅ Processamento automático de vídeos com IA
- ✅ Interface moderna e intuitiva

## 📦 Instalação

Escolha seu navegador e siga o guia específico:

### 🌐 Google Chrome
Veja: [INSTALL.md](INSTALL.md)

### 🌐 Microsoft Edge
Veja: [INSTALL-EDGE.md](INSTALL-EDGE.md)

### 🦊 Mozilla Firefox
Veja: [INSTALL-FIREFOX.md](INSTALL-FIREFOX.md)

### 🚀 Build Automatizado
Execute `build.cmd` (Windows) para criar pacotes para todos os navegadores automaticamente

## ⚙️ Configuração

1. Clique no ícone da extensão na barra de ferramentas
2. Configure:
   - **URL da API**: `https://enkpfnqsjjnanlqhjnsv.supabase.co`
   - **Chave de API**: Sua chave anon do Supabase (encontrada no arquivo `.env`)
3. As configurações são salvas automaticamente

## 🎯 Como Usar

### Método 1: Botão Flutuante
1. Navegue até um vídeo no YouTube, Instagram, TikTok, etc.
2. Clique no botão flutuante 🎬 no canto inferior direito
3. Confirme o compartilhamento

### Método 2: Ícone da Extensão
1. Navegue até um vídeo
2. Clique no ícone da extensão na barra de ferramentas
3. Clique em "Compartilhar Vídeo"

### Método 3: Menu de Contexto
1. Clique com o botão direito em qualquer lugar da página
2. Selecione "Compartilhar com InsightShare"

## 🔧 Desenvolvimento

### Estrutura de Arquivos

```
browser-extension/
├── manifest.json       # Configuração da extensão
├── popup.html         # Interface do popup
├── popup.js           # Lógica do popup
├── content.js         # Script injetado nas páginas
├── content.css        # Estilos do botão flutuante
├── background.js      # Service worker
├── icons/            # Ícones da extensão
└── README.md         # Documentação
```

### Adicionar Suporte para Nova Plataforma

Edite `content.js` e adicione um novo bloco no método `getVideoInfo()`:

```javascript
else if (url.includes('novaplatforma.com')) {
  videoInfo.platform = 'Nova Plataforma';
  videoInfo.title = document.querySelector('h1')?.textContent;
  videoInfo.thumbnail = document.querySelector('meta[property="og:image"]')?.content;
}
```

## 🎨 Ícones

Para produção, adicione ícones PNG na pasta `icons/`:
- `icon16.png` - 16x16px
- `icon32.png` - 32x32px
- `icon48.png` - 48x48px
- `icon128.png` - 128x128px

Você pode criar ícones usando o emoji 🎬 ou criar um logo personalizado.

## 🔒 Segurança

- A chave de API é armazenada localmente usando `chrome.storage.sync`
- Nunca compartilhe sua chave de API publicamente
- Use RLS (Row Level Security) no Supabase para proteger seus dados

## 📝 Notas

- A extensão requer que você esteja autenticado no InsightShare
- Os vídeos são processados automaticamente após o compartilhamento
- O processamento pode levar alguns segundos dependendo do tamanho do vídeo

## 🐛 Problemas Conhecidos

- Algumas plataformas podem ter estruturas HTML diferentes que impedem a detecção automática
- Vídeos privados ou com restrições podem não ser processados corretamente

## 📄 Licença

MIT License - Sinta-se livre para usar e modificar
