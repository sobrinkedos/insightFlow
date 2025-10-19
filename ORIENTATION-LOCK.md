# Bloqueio de Orientação no PWA

## Como Funciona

O app agora controla a orientação da tela de forma inteligente quando instalado como PWA:

### Comportamento Padrão
- **Fora do PWA (navegador)**: Orientação livre, funciona normalmente
- **No PWA**: Tela bloqueada em **portrait (vertical)** por padrão

### Durante Vídeo em Tela Cheia
- Ao entrar em fullscreen: Orientação muda para **landscape (horizontal)**
- Ao sair do fullscreen: Volta para **portrait (vertical)**

## Implementação

### 1. Hook Global (`use-orientation-lock.ts`)
```typescript
// Detecta se está rodando como PWA
const isPWA = window.matchMedia('(display-mode: standalone)').matches;

// Bloqueia em portrait apenas no PWA
if (isPWA) {
  await screen.orientation.lock('portrait');
}
```

### 2. Controle no VideoPlayer
```typescript
// Ao entrar em fullscreen
await lockToLandscape();

// Ao sair do fullscreen
await lockToPortrait(); // Volta para portrait no PWA
```

## Benefícios

✅ **Melhor UX**: Usuário não precisa ficar virando o celular o tempo todo
✅ **Intuitivo**: Só permite landscape quando faz sentido (vídeo em tela cheia)
✅ **Não afeta navegador**: Funciona normalmente quando não está instalado
✅ **Compatível**: Funciona em iOS e Android

## Testando

1. Instale o app como PWA no smartphone
2. Navegue pelo app - deve permanecer em portrait
3. Abra um vídeo e clique em tela cheia
4. A orientação deve mudar para landscape automaticamente
5. Saia da tela cheia - deve voltar para portrait

## Notas Técnicas

- Usa `screen.orientation.lock()` (padrão moderno)
- Fallback para `screen.lockOrientation()` (webkit/antigo)
- Detecta PWA via `display-mode: standalone`
- Delay de 200ms para garantir que fullscreen ative primeiro
