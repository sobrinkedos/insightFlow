# 🔧 Troubleshooting - Fullscreen Mobile

## Problema: Orientação Landscape Não Funciona

### Possíveis Causas

#### 1. **API de Screen Orientation Não Suportada**
A Screen Orientation API não é suportada em todos os navegadores/dispositivos.

**Navegadores com Suporte Limitado**:
- Safari iOS < 16.4
- Alguns navegadores Android antigos
- Navegadores em modo privado/anônimo

**Solução**: O app agora detecta a orientação via `window.innerWidth/innerHeight` e mostra uma mensagem para o usuário virar o celular manualmente.

#### 2. **Permissões do Navegador**
Alguns navegadores requerem que o site esteja em HTTPS ou seja um PWA instalado.

**Verificar**:
```javascript
// No console do navegador
console.log(screen.orientation); // Deve retornar objeto
console.log(screen.orientation.lock); // Deve ser uma função
```

**Solução**: 
- Use HTTPS em produção
- Instale como PWA para melhor suporte

#### 3. **Configurações do Dispositivo**
O usuário pode ter bloqueado a rotação automática nas configurações do dispositivo.

**Verificar**:
- Android: Configurações > Display > Rotação automática
- iOS: Central de Controle > Bloqueio de rotação

#### 4. **Iframe do YouTube**
O YouTube tem seus próprios controles de fullscreen que podem conflitar.

**Solução Implementada**:
- Adicionado `enablejsapi=1` e `playsinline=1` na URL do embed
- Fullscreen customizado no container pai
- Botão de fullscreen customizado

## Melhorias Implementadas

### 1. **Detecção de Orientação Melhorada**
```typescript
const handleOrientationChange = () => {
  if (window.innerWidth > window.innerHeight) {
    setOrientation("landscape");
  } else {
    setOrientation("portrait");
  }
};

window.addEventListener("resize", handleOrientationChange);
window.addEventListener("orientationchange", handleOrientationChange);
```

### 2. **Múltiplas Tentativas de Lock**
```typescript
// Tentativa 1: API moderna
await screen.orientation.lock("landscape");

// Tentativa 2: API webkit (fallback)
(screen as any).lockOrientation("landscape");
```

### 3. **Timeout para Lock**
```typescript
setTimeout(async () => {
  await screen.orientation.lock("landscape");
}, 100);
```

### 4. **Mensagem Condicional**
```tsx
{isFullscreen && orientation === "portrait" && (
  <div className="animate-pulse">
    🔄 Vire o celular para melhor visualização
  </div>
)}
```

### 5. **Meta Tags Adicionadas**
```html
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

### 6. **CSS para Landscape**
```css
@media screen and (orientation: landscape) {
  :fullscreen iframe {
    width: 100vw !important;
    height: 100vh !important;
  }
}
```

## Como Testar

### Teste 1: Verificar Suporte
```javascript
// Cole no console do navegador
console.log({
  fullscreenSupported: document.fullscreenEnabled,
  orientationSupported: !!screen.orientation,
  orientationLockSupported: !!(screen.orientation && screen.orientation.lock)
});
```

### Teste 2: Testar Fullscreen
1. Abra um vídeo
2. Clique no botão de Maximize
3. Verifique se entra em fullscreen
4. Vire o celular
5. Verifique se o vídeo se adapta

### Teste 3: Testar Orientação
1. Entre em fullscreen
2. Vire o celular para landscape
3. Mensagem deve desaparecer
4. Vídeo deve ocupar toda a tela
5. Vire de volta para portrait
6. Mensagem deve reaparecer

## Comportamento Esperado

### Portrait (Vertical)
```
┌─────────────┐
│ 🔄 Vire...  │ ← Mensagem visível
│             │
│   [Vídeo]   │
│             │
│             │
│ [Minimize]  │
└─────────────┘
```

### Landscape (Horizontal)
```
┌───────────────────────────────┐
│        [Vídeo Completo]       │
│                    [Minimize] │
└───────────────────────────────┘
                ↑ Mensagem oculta
```

## Alternativas

### Se Screen Orientation API Não Funcionar

#### Opção 1: Usar Fullscreen Nativo do YouTube
O YouTube tem seu próprio botão de fullscreen que funciona bem em mobile.

**Prós**:
- Sempre funciona
- Controles nativos do YouTube

**Contras**:
- Menos controle sobre a UI
- Pode sair do app

#### Opção 2: Instruções Visuais
Mostrar instruções claras para o usuário virar o celular.

**Implementado**:
```tsx
<div className="animate-pulse">
  🔄 Vire o celular para melhor visualização
</div>
```

#### Opção 3: PWA com Manifest
Instalar como PWA dá mais controle sobre orientação.

**manifest.webmanifest**:
```json
{
  "orientation": "any",
  "display": "standalone"
}
```

## Logs de Debug

### Ativar Logs
```typescript
// Adicione no componente VideoPlayer
console.log("Fullscreen state:", isFullscreen);
console.log("Orientation:", orientation);
console.log("Screen orientation:", screen.orientation?.type);
```

### Verificar Erros
```typescript
try {
  await screen.orientation.lock("landscape");
  console.log("✅ Orientation locked");
} catch (err) {
  console.error("❌ Orientation lock failed:", err);
}
```

## Compatibilidade

| Dispositivo | Navegador | Fullscreen | Orientation Lock | Status |
|-------------|-----------|------------|------------------|--------|
| iPhone 14   | Safari    | ✅         | ⚠️ iOS 16.4+     | Parcial |
| iPhone 14   | Chrome    | ✅         | ❌               | Funciona sem lock |
| Android 12+ | Chrome    | ✅         | ✅               | Completo |
| Android 12+ | Firefox   | ✅         | ✅               | Completo |
| iPad        | Safari    | ✅         | ⚠️               | Parcial |

**Legenda**:
- ✅ Funciona completamente
- ⚠️ Funciona com limitações
- ❌ Não funciona

## Solução de Problemas Comuns

### Problema: Botão não aparece
**Causa**: Hover não funciona em touch
**Solução**: Botão agora sempre visível em mobile

### Problema: Fullscreen não entra
**Causa**: Precisa ser acionado por interação do usuário
**Solução**: Botão de click/touch implementado

### Problema: Vídeo não ocupa tela toda
**Causa**: CSS não aplicado corretamente
**Solução**: CSS com `!important` e `100vw/vh`

### Problema: Orientação não bloqueia
**Causa**: API não suportada
**Solução**: Mensagem visual para usuário virar manualmente

## Recomendações

### Para Melhor Experiência
1. ✅ Use HTTPS em produção
2. ✅ Instale como PWA
3. ✅ Teste em dispositivos reais
4. ✅ Forneça instruções visuais
5. ✅ Implemente fallbacks

### Para Desenvolvedores
1. ✅ Sempre verifique suporte da API
2. ✅ Implemente múltiplos fallbacks
3. ✅ Adicione logs de debug
4. ✅ Teste em múltiplos navegadores
5. ✅ Documente limitações

---

**Nota**: A experiência pode variar dependendo do dispositivo, navegador e versão do sistema operacional. O app agora fornece a melhor experiência possível em cada cenário.
