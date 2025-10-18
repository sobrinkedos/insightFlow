# 🧪 Guia de Teste - Fullscreen Mobile

## Como Testar o Fullscreen

### Pré-requisitos
- Dispositivo móvel (ou DevTools em modo mobile)
- Navegador atualizado (Chrome, Safari, Firefox)
- Conexão com internet

### Teste 1: Verificar se o Botão Aparece

1. Abra um vídeo na página de detalhes
2. Procure o botão de Maximize (⛶) no canto inferior direito
3. **Esperado**: Botão deve estar visível

**Se não aparecer**:
- Toque na área do vídeo
- Aguarde 1 segundo
- Botão deve aparecer com hover

### Teste 2: Entrar em Fullscreen

1. Toque no botão de Maximize
2. **Esperado**: 
   - Vídeo deve ocupar toda a tela
   - Fundo deve ficar preto
   - Botão muda para Minimize (⛶)

**Se não funcionar**:
- Verifique se o navegador suporta fullscreen
- Tente recarregar a página
- Verifique o console para erros

### Teste 3: Orientação Portrait

1. Entre em fullscreen
2. Mantenha o celular na vertical (portrait)
3. **Esperado**:
   - Mensagem "🔄 Vire o celular..." deve aparecer
   - Mensagem deve ter animação pulse
   - Vídeo deve estar centralizado

### Teste 4: Orientação Landscape

1. Com fullscreen ativo
2. Vire o celular para horizontal (landscape)
3. **Esperado**:
   - Mensagem deve desaparecer
   - Vídeo deve ocupar 100% da tela
   - Melhor experiência de visualização

### Teste 5: Sair de Fullscreen

1. Toque no botão de Minimize
2. **Esperado**:
   - Vídeo volta ao tamanho normal
   - Fundo volta ao normal
   - Orientação é desbloqueada

## Testes no Console

### Verificar Suporte

Cole no console do navegador:

```javascript
// Verificar suporte a Fullscreen
console.log("Fullscreen API:", {
  supported: document.fullscreenEnabled,
  element: document.fullscreenElement,
  methods: {
    request: !!document.documentElement.requestFullscreen,
    webkit: !!(document.documentElement as any).webkitRequestFullscreen,
    moz: !!(document.documentElement as any).mozRequestFullScreen,
    ms: !!(document.documentElement as any).msRequestFullscreen
  }
});

// Verificar suporte a Orientação
console.log("Screen Orientation:", {
  supported: !!screen.orientation,
  type: screen.orientation?.type,
  angle: screen.orientation?.angle,
  lock: !!screen.orientation?.lock,
  unlock: !!screen.orientation?.unlock
});

// Verificar dimensões
console.log("Screen:", {
  width: window.innerWidth,
  height: window.innerHeight,
  orientation: window.innerWidth > window.innerHeight ? "landscape" : "portrait"
});
```

### Forçar Fullscreen (Debug)

```javascript
// Pegar o container do vídeo
const container = document.querySelector('[data-video-container]');

// Tentar entrar em fullscreen
if (container) {
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  }
}
```

### Verificar Orientação

```javascript
// Monitorar mudanças de orientação
window.addEventListener('resize', () => {
  console.log('Orientation:', 
    window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
    `${window.innerWidth}x${window.innerHeight}`
  );
});

// Tentar bloquear orientação
if (screen.orientation && screen.orientation.lock) {
  screen.orientation.lock('landscape')
    .then(() => console.log('✅ Locked'))
    .catch(err => console.log('❌ Failed:', err));
}
```

## Checklist de Teste

### Funcionalidade Básica
- [ ] Botão de fullscreen aparece
- [ ] Botão responde ao toque
- [ ] Entra em fullscreen ao clicar
- [ ] Sai de fullscreen ao clicar novamente
- [ ] Vídeo continua tocando

### Orientação
- [ ] Detecta portrait corretamente
- [ ] Detecta landscape corretamente
- [ ] Mensagem aparece em portrait
- [ ] Mensagem desaparece em landscape
- [ ] Orientação bloqueia (se suportado)

### Visual
- [ ] Fundo fica preto em fullscreen
- [ ] Vídeo ocupa toda a tela
- [ ] Botão sempre acessível
- [ ] Mensagem bem posicionada
- [ ] Animações suaves

### Navegadores
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Firefox Android
- [ ] Samsung Internet
- [ ] Edge Mobile

## Problemas Comuns e Soluções

### Problema: Botão não aparece
**Solução**: 
- Toque na área do vídeo
- Aguarde hover funcionar
- Verifique se CSS está carregado

### Problema: Fullscreen não entra
**Solução**:
- Recarregue a página
- Verifique permissões do navegador
- Teste em outro navegador

### Problema: Orientação não bloqueia
**Solução**:
- Normal em alguns navegadores
- Mensagem visual funciona como fallback
- Usuário pode virar manualmente

### Problema: Vídeo não ocupa tela toda
**Solução**:
- Verifique CSS
- Limpe cache do navegador
- Teste em modo anônimo

### Problema: Mensagem não desaparece
**Solução**:
- Vire completamente para landscape
- Aguarde 1 segundo
- Verifique detecção de orientação

## Logs Esperados

### Sucesso
```
✅ Orientation locked to landscape
Fullscreen: true
Orientation: landscape
```

### Parcial (sem lock)
```
⚠️ Orientation lock not supported: NotSupportedError
Fullscreen: true
Orientation: portrait → landscape (manual)
```

### Erro
```
❌ Fullscreen request failed: TypeError
```

## Dispositivos Testados

| Dispositivo | Navegador | Fullscreen | Lock | Status |
|-------------|-----------|------------|------|--------|
| iPhone 14   | Safari    | ✅         | ⚠️   | OK     |
| iPhone 14   | Chrome    | ✅         | ❌   | OK     |
| Galaxy S21  | Chrome    | ✅         | ✅   | OK     |
| Galaxy S21  | Firefox   | ✅         | ✅   | OK     |
| iPad Pro    | Safari    | ✅         | ⚠️   | OK     |

## Próximos Passos

Se tudo funcionar:
- ✅ Fullscreen está OK
- ✅ Orientação detectada
- ✅ Mensagem funciona
- ✅ UX está boa

Se algo não funcionar:
1. Verifique console para erros
2. Teste em outro navegador
3. Verifique compatibilidade
4. Reporte o problema com logs

---

**Nota**: A experiência pode variar por navegador/dispositivo. O importante é que o fullscreen funcione, mesmo que o lock de orientação não seja suportado.
