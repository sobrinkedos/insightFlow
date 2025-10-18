# 📱 Visualização de Vídeo em Fullscreen Mobile

## 🎯 Recurso Implementado

Suporte completo para visualização de vídeos em tela cheia com orientação automática em landscape quando o dispositivo é virado.

## ✨ Funcionalidades

### 1. Botão de Fullscreen
- **Desktop**: Sempre visível no canto inferior direito do player
- **Mobile**: Aparece ao tocar no vídeo (hover)
- **Ícone**: Maximize (expandir) / Minimize (sair)

### 2. Orientação Landscape Automática
- Ao entrar em fullscreen em mobile, sugere virar o celular
- Tenta bloquear orientação em landscape (quando suportado)
- Desbloqueia orientação ao sair do fullscreen

### 3. Interface Adaptativa
- **Fullscreen**: Fundo preto, vídeo centralizado
- **Instruções**: Mensagem "Vire o celular para melhor visualização" (apenas mobile)
- **Controles**: Botão de sair sempre acessível

## 🔧 Componente VideoPlayer

### Localização
```
src/components/video-player.tsx
```

### Props
```typescript
interface VideoPlayerProps {
  embedUrl: string;    // URL do embed do YouTube
  title?: string;      // Título do vídeo (opcional)
  className?: string;  // Classes CSS adicionais (opcional)
}
```

### Uso
```tsx
import { VideoPlayer } from "@/components/video-player";

<VideoPlayer 
  embedUrl="https://www.youtube.com/embed/VIDEO_ID"
  title="Título do Vídeo"
/>
```

## 📱 Comportamento Mobile

### Entrar em Fullscreen
1. Usuário toca no botão de maximizar
2. Vídeo entra em fullscreen
3. Tela fica preta com vídeo centralizado
4. Mensagem aparece sugerindo virar o celular
5. Orientação tenta bloquear em landscape (se suportado)

### Sair de Fullscreen
1. Usuário toca no botão de minimizar
2. Vídeo sai de fullscreen
3. Orientação é desbloqueada
4. Retorna ao layout normal

### Orientação do Dispositivo
```
Portrait (vertical):
┌─────────┐
│         │
│  Video  │
│         │
│         │
│         │
└─────────┘

Landscape (horizontal):
┌───────────────────┐
│      Video        │
└───────────────────┘
```

## 🎨 Estilos CSS

### Fullscreen Container
```css
.fullscreen-container {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Background Preto
```css
:fullscreen {
  background-color: black;
}
```

## 🌐 Compatibilidade de Navegadores

### Fullscreen API
| Navegador | Suporte | Prefixo |
|-----------|---------|---------|
| Chrome    | ✅ Sim  | webkit  |
| Safari    | ✅ Sim  | webkit  |
| Firefox   | ✅ Sim  | moz     |
| Edge      | ✅ Sim  | -       |
| Opera     | ✅ Sim  | webkit  |

### Screen Orientation API
| Navegador | Suporte | Notas |
|-----------|---------|-------|
| Chrome    | ✅ Sim  | Completo |
| Safari    | ⚠️ Parcial | iOS 16.4+ |
| Firefox   | ✅ Sim  | Android |
| Edge      | ✅ Sim  | Completo |

## 🔒 Permissões

### Fullscreen
- Não requer permissão do usuário
- Deve ser acionado por interação do usuário (clique/toque)

### Screen Orientation
- Pode requerer permissão em alguns navegadores
- Funciona melhor em apps instalados (PWA)
- Fallback gracioso se não suportado

## 🎯 Casos de Uso

### 1. Assistir Tutorial
```
Usuário → Abre vídeo → Toca em fullscreen → Vira celular → Assiste em landscape
```

### 2. Apresentação
```
Usuário → Abre vídeo → Fullscreen → Projeta em tela grande
```

### 3. Foco Total
```
Usuário → Fullscreen → Remove distrações → Foca no conteúdo
```

## 🐛 Tratamento de Erros

### Fullscreen Não Suportado
```typescript
try {
  await element.requestFullscreen();
} catch (err) {
  console.error("Fullscreen not supported");
  // Fallback: Continua sem fullscreen
}
```

### Orientação Não Suportada
```typescript
try {
  await screen.orientation.lock("landscape");
} catch (err) {
  console.log("Orientation lock not supported");
  // Fallback: Usuário vira manualmente
}
```

## 📊 Eventos

### Fullscreen Change
```typescript
document.addEventListener("fullscreenchange", () => {
  const isFullscreen = !!document.fullscreenElement;
  // Atualizar estado
});
```

### Orientação Change
```typescript
screen.orientation.addEventListener("change", () => {
  const orientation = screen.orientation.type;
  // landscape-primary, portrait-primary, etc.
});
```

## 🎨 Customização

### Botão de Fullscreen
```tsx
<Button
  variant="secondary"
  size="icon"
  className="absolute bottom-4 right-4"
  onClick={toggleFullscreen}
>
  {isFullscreen ? <Minimize /> : <Maximize />}
</Button>
```

### Mensagem de Instrução
```tsx
{isFullscreen && (
  <div className="absolute top-4 left-1/2 -translate-x-1/2">
    <div className="bg-black/80 text-white text-xs px-3 py-2 rounded-full">
      Vire o celular para melhor visualização
    </div>
  </div>
)}
```

## 🚀 Melhorias Futuras

### Curto Prazo
- [ ] Controles de volume no fullscreen
- [ ] Barra de progresso customizada
- [ ] Gesture para sair (swipe down)

### Médio Prazo
- [ ] Picture-in-Picture (PiP)
- [ ] Controles de playback
- [ ] Legendas customizadas

### Longo Prazo
- [ ] Player nativo (não iframe)
- [ ] Suporte a múltiplas plataformas (Vimeo, etc.)
- [ ] Streaming adaptativo

## 📱 Testes

### Dispositivos Testados
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)
- [ ] Android Tablet (Chrome)

### Orientações Testadas
- [ ] Portrait → Landscape
- [ ] Landscape → Portrait
- [ ] Fullscreen em Portrait
- [ ] Fullscreen em Landscape

### Navegadores Testados
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Firefox Android
- [ ] Samsung Internet

## 💡 Dicas de Uso

### Para Usuários
1. Toque no botão de maximizar para fullscreen
2. Vire o celular para landscape para melhor visualização
3. Toque no botão de minimizar para sair

### Para Desenvolvedores
1. Use `VideoPlayer` em vez de iframe direto
2. Teste em dispositivos reais
3. Verifique compatibilidade de navegadores
4. Implemente fallbacks para APIs não suportadas

## 🔗 Referências

- [Fullscreen API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API)
- [Screen Orientation API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Orientation_API)
- [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference)

---

**Status**: ✅ Implementado e funcional
**Versão**: 1.0.0
**Data**: 2025-10-17
