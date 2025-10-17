# Botão Flutuante - InsightShare Extension

## 🎯 Como funciona

O botão flutuante aparece automaticamente em páginas de vídeo suportadas e permite compartilhar o vídeo diretamente com o InsightShare.

## ✨ Funcionalidades

### **Botão Flutuante:**
- 🎬 Ícone de filme no canto inferior direito
- 🟣 Gradiente roxo (marca do InsightShare)
- ✨ Animação suave ao aparecer
- 🔄 Hover effect (aumenta ao passar o mouse)
- 📍 Sempre visível (z-index alto)

### **Ao clicar:**
1. Detecta automaticamente a URL do vídeo
2. Extrai o título do vídeo
3. Abre o InsightShare em nova aba
4. Preenche automaticamente a URL no formulário
5. Usuário só precisa confirmar o compartilhamento

## 🌐 Plataformas Suportadas

- ✅ YouTube
- ✅ Instagram
- ✅ TikTok
- ✅ Vimeo
- ✅ Dailymotion

## 🔧 Fluxo Técnico

```
1. Usuário está assistindo vídeo
   ↓
2. Botão flutuante aparece
   ↓
3. Usuário clica no botão
   ↓
4. Extension detecta URL e título
   ↓
5. Abre: insightshare.vercel.app/share?url=...&title=...
   ↓
6. Página /share processa:
   - Se logado → Redireciona para /videos com URL preenchida
   - Se não logado → Redireciona para /login, depois /videos
   ↓
7. Dialog abre automaticamente com URL preenchida
   ↓
8. Usuário confirma e vídeo é compartilhado
```

## 🎨 Estilo do Botão

```css
- Tamanho: 56x56px
- Formato: Circular
- Cor: Gradiente roxo (#667eea → #764ba2)
- Posição: Canto inferior direito (24px de margem)
- Sombra: Suave com cor roxa
- Animação: Fade in ao aparecer
- Hover: Aumenta 10% e sombra mais forte
```

## 🔄 Integração com o Site

### **Página /share:**
A página `/share` no site processa os parâmetros:
- `url` - URL do vídeo
- `title` - Título do vídeo (opcional)

### **Fluxo de Autenticação:**
1. Verifica se usuário está logado
2. Se não → Redireciona para login com returnUrl
3. Se sim → Salva URL no localStorage
4. Redireciona para /videos
5. Dialog abre automaticamente

### **Dialog de Compartilhamento:**
O componente `ShareVideoDialog` detecta:
```javascript
useEffect(() => {
  const sharedUrl = localStorage.getItem('sharedVideoUrl');
  if (sharedUrl) {
    form.setValue('url', sharedUrl);
    setOpen(true);
    localStorage.removeItem('sharedVideoUrl');
  }
}, []);
```

## 🚀 Vantagens

### **Para o Usuário:**
- ✅ Um clique para compartilhar
- ✅ Não precisa copiar/colar URL
- ✅ Funciona em qualquer plataforma suportada
- ✅ Sempre visível e acessível
- ✅ Integração perfeita com o site

### **Vs. Popup da Extensão:**
- ❌ Popup: Requer login na extensão
- ❌ Popup: Configuração de API keys
- ✅ Botão: Usa login do site
- ✅ Botão: Sem configuração necessária
- ✅ Botão: Experiência unificada

## 📝 Configuração

### **URL do Site:**
Atualmente configurado para:
```javascript
const insightShareUrl = `https://insightshare.vercel.app/share?url=...`;
```

Para desenvolvimento local, altere para:
```javascript
const insightShareUrl = `http://localhost:5173/share?url=...`;
```

## 🐛 Troubleshooting

### **Botão não aparece:**
- Verifique se está em uma página de vídeo suportada
- Recarregue a página
- Verifique se a extensão está ativada

### **Botão aparece mas não funciona:**
- Verifique o console do navegador
- Certifique-se de que pop-ups não estão bloqueados
- Tente clicar novamente

### **URL não é preenchida no site:**
- Verifique se o localStorage está habilitado
- Limpe o cache do navegador
- Faça login novamente

## 🔐 Segurança

- ✅ Não armazena credenciais
- ✅ Usa autenticação do site
- ✅ Não envia dados para servidores externos
- ✅ Apenas detecta URL pública do vídeo

## 📊 Comparação: Botão vs Popup

| Feature | Botão Flutuante | Popup |
|---------|----------------|-------|
| Visibilidade | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Facilidade | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Configuração | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Autenticação | Site | Extensão |
| Cliques | 1 | 2-3 |

## 🎯 Recomendação

**Use o botão flutuante** para a melhor experiência:
- Mais rápido
- Mais fácil
- Sem configuração
- Integração perfeita

O popup ainda está disponível para usuários que preferem não abrir nova aba.
