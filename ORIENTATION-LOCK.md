# Bloqueio de Orientação no PWA

## Como Funciona

O app agora controla a orientação da tela de forma inteligente quando instalado como PWA:

### Comportamento Padrão
- **Fora do PWA (navegador)**: Orientação livre, funciona normalmente
- **No PWA**: Tela bloqueada em **portrait (vertical)** por padrão

### Na Página de Vídeo
- **Orientação livre**: Pode virar o celular para landscape ou portrait
- Permite melhor visualização do vídeo sem precisar entrar em fullscreen
- Ao sair da página de vídeo, volta para portrait automaticamente

### Em Fullscreen
- **Força landscape**: Ao entrar em tela cheia, força orientação horizontal
- Melhor experiência para assistir vídeos
- Ao sair do fullscreen, volta para orientação livre da página

## Implementação

### 1. Hook Global (`use-orientation-lock.ts`)
```typescript
// Detecta se está rodando como PWA
const isPWA = window.matchMedia('(display-mode: standalone)').matches;

// Bloqueia em portrait apenas no PWA (se não for página de vídeo)
if (isPWA && !allowFreeOrientation) {
  await screen.orientation.lock('portrait');
}
```

### 2. Página de Vídeo (`video-detail.tsx`)
```typescript
// Permite orientação livre na página de vídeo
useOrientationLock(true);
```

### 3. VideoPlayer - Fullscreen
```typescript
// Ao entrar em fullscreen, força landscape
if (success) {
  setTimeout(() => {
    lockToLandscape();
  }, 300);
}
```

### 4. Outras Páginas (`App.tsx`)
```typescript
// Bloqueia em portrait por padrão
useOrientationLock();
```

## Benefícios

✅ **Melhor UX**: Usuário não precisa ficar virando o celular o tempo todo
✅ **Intuitivo**: Orientação livre apenas na página de vídeo
✅ **Flexível**: Pode assistir vídeo em portrait ou landscape sem fullscreen
✅ **Não afeta navegador**: Funciona normalmente quando não está instalado
✅ **Compatível**: Funciona em iOS e Android

## Testando

### ⚠️ IMPORTANTE: Você precisa REINSTALAR o PWA!

Após fazer deploy das alterações:

1. **Desinstale o PWA atual** do smartphone
2. **Limpe o cache** do navegador
3. **Reinstale o app** como PWA
4. Navegue pelo app - deve permanecer em portrait
5. Abra uma página de vídeo - orientação fica livre
6. Vire o celular - deve funcionar normalmente
7. Volte para outra página - deve bloquear em portrait novamente

### Por que reinstalar?

O manifest.webmanifest é cacheado pelo navegador quando você instala o PWA. Mudanças no manifest (como a orientação) só são aplicadas em uma nova instalação.

## Notas Técnicas

- Usa `screen.orientation.lock()` (padrão moderno)
- Fallback para `screen.lockOrientation()` (webkit/antigo)
- Detecta PWA via `display-mode: standalone`
- Delay de 200ms para garantir que fullscreen ative primeiro
