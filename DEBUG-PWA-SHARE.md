# 🐛 Debug: PWA Share não está funcionando

## 📋 Checklist de Debug

### 1. Verificar Console do Navegador

Abra o DevTools (F12) e procure por:

```
📱 Share data saved: { url: "...", title: "...", ... }
✅ User logged in, processing share...
📱 Saving to localStorage: { url: "...", title: "..." }
✅ Verified localStorage: "..."
🔄 Navigating to /videos...
📱 Checking for shared video URL: "..."
✅ Found shared URL, opening modal...
```

### 2. Verificar localStorage

No console do navegador:

```javascript
// Ver o que está salvo
console.log('sharedVideoUrl:', localStorage.getItem('sharedVideoUrl'));
console.log('sharedVideoTitle:', localStorage.getItem('sharedVideoTitle'));

// Ver todos os itens
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(key, ':', localStorage.getItem(key));
}
```

### 3. Verificar sessionStorage

```javascript
// Ver dados pendentes
console.log('pendingShare:', sessionStorage.getItem('pendingShare'));
```

### 4. Testar Manualmente

```javascript
// Simular compartilhamento
localStorage.setItem('sharedVideoUrl', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');

// Recarregar a página /videos
window.location.href = '/videos';
```

## 🔍 Problemas Comuns

### Problema 1: Modal não abre

**Sintomas:**
- URL está no localStorage
- Logs mostram "Found shared URL"
- Mas modal não abre

**Causa:** Componente não está montado ou setOpen não funciona

**Solução:**
```typescript
// Adicionar delay maior
setTimeout(() => {
  setOpen(true);
}, 500); // Aumentar para 500ms
```

### Problema 2: URL não está no localStorage

**Sintomas:**
- Logs mostram "No shared URL found"
- localStorage está vazio

**Causa:** URL não foi salva ou foi limpa antes

**Verificar:**
1. SharePage está salvando? (ver logs "Saving to localStorage")
2. Navegação está funcionando? (ver logs "Navigating to /videos")
3. localStorage está habilitado?

**Solução:**
```javascript
// Testar se localStorage funciona
try {
  localStorage.setItem('test', 'value');
  console.log('localStorage works:', localStorage.getItem('test'));
  localStorage.removeItem('test');
} catch (e) {
  console.error('localStorage not available:', e);
}
```

### Problema 3: URL é limpa antes do modal abrir

**Sintomas:**
- Logs mostram "Found shared URL"
- Mas URL é removida imediatamente
- Modal abre vazio

**Causa:** localStorage.removeItem() é chamado antes do form.setValue()

**Solução:** Já implementado - removemos DEPOIS de setar o valor

### Problema 4: Compartilhar múltiplas vezes

**Sintomas:**
- Primeiro compartilhamento funciona
- Segundo não funciona

**Causa:** localStorage não é limpo corretamente

**Solução:**
```javascript
// Limpar tudo antes de salvar novo
localStorage.removeItem('sharedVideoUrl');
localStorage.removeItem('sharedVideoTitle');
sessionStorage.removeItem('pendingShare');

// Depois salvar novo
localStorage.setItem('sharedVideoUrl', newUrl);
```

## 🧪 Testes Passo a Passo

### Teste 1: Compartilhamento Básico

1. Abra o DevTools (F12)
2. Vá para a aba Console
3. Compartilhe um vídeo via PWA
4. Observe os logs:

```
Esperado:
📱 Share data saved: ...
✅ User logged in, processing share...
📱 Saving to localStorage: ...
✅ Verified localStorage: ...
🔄 Navigating to /videos...
📱 Checking for shared video URL: ...
✅ Found shared URL, opening modal...
```

### Teste 2: Verificar Timing

```javascript
// No console, após compartilhar
setTimeout(() => {
  console.log('After 1s:', localStorage.getItem('sharedVideoUrl'));
}, 1000);

setTimeout(() => {
  console.log('After 2s:', localStorage.getItem('sharedVideoUrl'));
}, 2000);
```

### Teste 3: Forçar Abertura do Modal

```javascript
// No console da página /videos
const button = document.querySelector('#share-video-trigger');
if (button) {
  button.click();
  console.log('Modal opened manually');
} else {
  console.error('Button not found');
}
```

## 🔧 Soluções Alternativas

### Solução 1: Usar Query Params

Se localStorage não funcionar, usar URL:

```typescript
// SharePage
navigate(`/videos?shareUrl=${encodeURIComponent(url)}`);

// VideosPage
const [searchParams] = useSearchParams();
const shareUrl = searchParams.get('shareUrl');
if (shareUrl) {
  // Abrir modal com shareUrl
}
```

### Solução 2: Usar Context API

```typescript
// ShareContext
const ShareContext = createContext();

export function ShareProvider({ children }) {
  const [pendingShare, setPendingShare] = useState(null);
  
  return (
    <ShareContext.Provider value={{ pendingShare, setPendingShare }}>
      {children}
    </ShareContext.Provider>
  );
}

// SharePage
const { setPendingShare } = useShare();
setPendingShare({ url, title });
navigate('/videos');

// ShareVideoDialog
const { pendingShare, setPendingShare } = useShare();
useEffect(() => {
  if (pendingShare) {
    form.setValue('url', pendingShare.url);
    setOpen(true);
    setPendingShare(null);
  }
}, [pendingShare]);
```

### Solução 3: Usar Event Emitter

```typescript
// events.ts
export const shareEvents = new EventTarget();

// SharePage
shareEvents.dispatchEvent(new CustomEvent('share', { 
  detail: { url, title } 
}));

// ShareVideoDialog
useEffect(() => {
  const handleShare = (e) => {
    form.setValue('url', e.detail.url);
    setOpen(true);
  };
  
  shareEvents.addEventListener('share', handleShare);
  return () => shareEvents.removeEventListener('share', handleShare);
}, []);
```

## 📱 Teste no Mobile Real

### Android Chrome

1. Instalar PWA
2. Compartilhar vídeo
3. Escolher PWA
4. Abrir DevTools via USB debugging
5. Ver logs no console

### iOS Safari

1. Instalar PWA
2. Compartilhar vídeo
3. Escolher PWA
4. Conectar Safari no Mac
5. Develop → iPhone → Ver console

## ✅ Checklist de Funcionamento

- [ ] Logs aparecem no console
- [ ] localStorage tem a URL
- [ ] Navegação para /videos funciona
- [ ] Componente ShareVideoDialog está montado
- [ ] useEffect é executado
- [ ] form.setValue funciona
- [ ] setOpen(true) é chamado
- [ ] Modal abre visualmente
- [ ] URL está preenchida no input
- [ ] Toast de notificação aparece

## 🎯 Próximos Passos

Se nada funcionar:

1. **Adicionar mais logs** em cada etapa
2. **Testar manualmente** via console
3. **Usar solução alternativa** (Query Params ou Context)
4. **Verificar versão do navegador** (pode ter bug)
5. **Testar em outro dispositivo**

## 📞 Informações para Suporte

Se precisar de ajuda, forneça:

1. **Logs do console** (copiar tudo)
2. **Navegador e versão** (Chrome 120, Safari 17, etc)
3. **Sistema operacional** (Android 14, iOS 17, etc)
4. **Passos para reproduzir**
5. **Screenshots** do console e da tela
