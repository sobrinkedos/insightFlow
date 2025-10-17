# Setup - InsightShare Extension

## 🔧 Configuração da URL

A extensão precisa saber para onde enviar os vídeos compartilhados.

### **Arquivo de Configuração:**
Edite o arquivo `config.js`:

```javascript
// Para desenvolvimento local:
const INSIGHTSHARE_URL = 'http://localhost:5174';

// Para produção (após deploy):
const INSIGHTSHARE_URL = 'https://seu-site.vercel.app';
```

## 🚀 Desenvolvimento Local

### **1. Inicie o servidor local:**
```bash
npm run dev
```

O Vite geralmente usa a porta `5173` ou `5174`. Verifique no terminal.

### **2. Configure a extensão:**
No arquivo `config.js`:
```javascript
const INSIGHTSHARE_URL = 'http://localhost:5174';
```

### **3. Recarregue a extensão:**
- Vá em `chrome://extensions/`
- Clique em 🔄 Recarregar

### **4. Teste:**
- Abra um vídeo do YouTube
- Clique no botão flutuante 🎬
- Deve abrir `localhost:5174/share?url=...`

## 🌐 Produção

### **1. Faça deploy do site:**
```bash
# Vercel (recomendado)
vercel --prod

# Ou via Git
git push
```

### **2. Obtenha a URL do deploy:**
Exemplo: `https://insightflow.vercel.app`

### **3. Configure a extensão:**
No arquivo `config.js`:
```javascript
const INSIGHTSHARE_URL = 'https://insightflow.vercel.app';
```

### **4. Recarregue a extensão:**
- Vá em `chrome://extensions/`
- Clique em 🔄 Recarregar

### **5. Teste:**
- Abra um vídeo do YouTube
- Clique no botão flutuante 🎬
- Deve abrir seu site em produção

## 🐛 Troubleshooting

### **Erro 404: NOT_FOUND**
**Causa:** URL incorreta no `config.js`

**Solução:**
1. Verifique se o site está rodando
2. Confirme a URL correta (porta, domínio)
3. Atualize `config.js`
4. Recarregue a extensão

### **Botão não funciona**
**Causa:** Configuração não carregada

**Solução:**
1. Verifique se `config.js` está no manifest
2. Recarregue a extensão
3. Recarregue a página do YouTube

### **Site não abre**
**Causa:** Pop-ups bloqueados

**Solução:**
1. Permita pop-ups para o YouTube
2. Ou clique com botão direito > "Abrir em nova aba"

## 📝 Checklist de Deploy

Antes de distribuir a extensão:

- [ ] Site deployado e funcionando
- [ ] URL de produção configurada em `config.js`
- [ ] Extensão testada com URL de produção
- [ ] Botão flutuante funciona
- [ ] Página `/share` funciona
- [ ] Login e compartilhamento funcionam
- [ ] Documentação atualizada

## 🔄 Mudando entre Dev e Prod

### **Método 1: Editar config.js**
```javascript
// Comente/descomente conforme necessário
// const INSIGHTSHARE_URL = 'http://localhost:5174'; // Dev
const INSIGHTSHARE_URL = 'https://seu-site.vercel.app'; // Prod
```

### **Método 2: Duas versões da extensão**
- Mantenha duas pastas: `browser-extension-dev` e `browser-extension-prod`
- Cada uma com seu próprio `config.js`
- Carregue a versão apropriada no Chrome

## 🎯 URLs Comuns

### **Desenvolvimento:**
- Vite: `http://localhost:5173` ou `http://localhost:5174`
- Create React App: `http://localhost:3000`
- Next.js: `http://localhost:3000`

### **Produção:**
- Vercel: `https://seu-projeto.vercel.app`
- Netlify: `https://seu-projeto.netlify.app`
- Domínio customizado: `https://seu-dominio.com`

## 📦 Build para Distribuição

Quando estiver pronto para distribuir:

1. Configure URL de produção
2. Teste completamente
3. Crie ZIP da pasta `browser-extension`
4. Publique na Chrome Web Store

```bash
# Criar ZIP
cd browser-extension
zip -r insightshare-extension.zip .
```

## ⚠️ Importante

- ✅ **Sempre teste** após mudar a URL
- ✅ **Recarregue a extensão** após editar arquivos
- ✅ **Use HTTPS** em produção
- ✅ **Documente** a URL para outros desenvolvedores
