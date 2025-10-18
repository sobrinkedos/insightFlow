# Estrutura Mobile do InsightShare

## 📱 Arquitetura Visual

```
┌─────────────────────────────────────────────────────────┐
│                    MOBILE LAYOUT                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │              HEADER (h-14)                        │ │
│  │  ☰  [Logo]  InsightShare           🔍  👤        │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │                                                   │ │
│  │              MAIN CONTENT                         │ │
│  │           (pb-16 for bottom nav)                  │ │
│  │                                                   │ │
│  │  • Home Dashboard                                 │ │
│  │  • Temas Grid                                     │ │
│  │  • Vídeos List                                    │ │
│  │  • Favoritos List                                 │ │
│  │  • Login/Signup Forms                             │ │
│  │                                                   │ │
│  │                                                   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │           BOTTOM NAVIGATION (h-16)                │ │
│  │                                                   │ │
│  │   🏠      📁       ➕       🎬      ❤️           │ │
│  │  Início  Temas  Adicionar Vídeos  Favoritos      │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Componentes de Navegação

### 1. Mobile Drawer (Lateral)

```
┌──────────────────────┐
│  MOBILE DRAWER       │
│  (width: 280px)      │
├──────────────────────┤
│                      │
│  ┌────┐              │
│  │ 👤 │  Usuário     │
│  └────┘  email@...   │
│                      │
│  ──────────────────  │
│                      │
│  🏠  Início          │
│  📁  Meus Temas      │
│  🎬  Vídeos Recentes │
│  ❤️  Favoritos       │
│  📥  Extensões       │
│                      │
│  ──────────────────  │
│                      │
│  👤  Perfil          │
│  ⚙️  Configurações   │
│  🌙  Modo Escuro     │
│                      │
│  ──────────────────  │
│                      │
│  🚪  Sair            │
│                      │
└──────────────────────┘
```

### 2. Bottom Navigation

```
┌─────────────────────────────────────────┐
│     BOTTOM NAVIGATION BAR (h-16)       │
├─────────────────────────────────────────┤
│                                         │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐│
│  │ 🏠 │  │ 📁 │  │ ➕ │  │ 🎬 │  │ ❤️ ││
│  └────┘  └────┘  └────┘  └────┘  └────┘│
│  Início  Temas   Add    Vídeos   Fav   │
│                   ↑                     │
│              (Flutuante)                │
└─────────────────────────────────────────┘
```

### 3. Mobile Search Dialog

```
┌─────────────────────────────────────┐
│  Pesquisar                      ✕   │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🔍  Pesquisar vídeos...    ✕ │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌──────────┐  ┌──────────┐       │
│  │Pesquisar │  │ Cancelar │       │
│  └──────────┘  └──────────┘       │
│                                     │
└─────────────────────────────────────┘
```

## 📄 Estrutura de Páginas

### Home (Mobile)

```
┌─────────────────────────────────────┐
│  Olá, Usuário! 👋                   │
│  Bem-vindo de volta...              │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────┐  ┌──────────┐       │
│  │ 📊 Total │  │ 📁 Temas │       │
│  │   42     │  │    12    │       │
│  └──────────┘  └──────────┘       │
│                                     │
│  ┌──────────┐  ┌──────────┐       │
│  │ ⚡ Hoje  │  │ ❤️ Favs  │       │
│  │    5     │  │    8     │       │
│  └──────────┘  └──────────┘       │
│                                     │
├─────────────────────────────────────┤
│  📥 Extensões Disponíveis!          │
│  Baixe agora...                     │
├─────────────────────────────────────┤
│                                     │
│  Temas em Destaque                  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📁 Tema 1                   │   │
│  │ Descrição...                │   │
│  │ 5 vídeos                    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📁 Tema 2                   │   │
│  │ Descrição...                │   │
│  │ 3 vídeos                    │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  Últimos Vídeos                     │
│                                     │
│  ┌────┬────────────────────────┐   │
│  │[📷]│ Título do Vídeo        │   │
│  │    │ Canal • há 2 horas     │   │
│  └────┴────────────────────────┘   │
│                                     │
│  ┌────┬────────────────────────┐   │
│  │[📷]│ Outro Vídeo            │   │
│  │    │ Canal • há 1 dia       │   │
│  └────┴────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Vídeos (Mobile)

```
┌─────────────────────────────────────┐
│  Vídeos Recentes                    │
│  Gerencie todos os seus vídeos      │
│                                     │
│  [Filtrar ▼] [Exportar]            │
├─────────────────────────────────────┤
│                                     │
│  [Todos] [Processando] [Processados]│
│                                     │
├─────────────────────────────────────┤
│                                     │
│  ┌────┬──────────────────┬──────┐  │
│  │[📷]│ Título do Vídeo  │ ❤️ ⋮ │  │
│  │    │ YouTube • 2h     │      │  │
│  └────┴──────────────────┴──────┘  │
│                                     │
│  ┌────┬──────────────────┬──────┐  │
│  │[📷]│ Outro Vídeo      │ ❤️ ⋮ │  │
│  │    │ Instagram • 1d   │      │  │
│  └────┴──────────────────┴──────┘  │
│                                     │
│  ┌────┬──────────────────┬──────┐  │
│  │[📷]│ Mais um Vídeo    │ ❤️ ⋮ │  │
│  │    │ TikTok • 3d      │      │  │
│  └────┴──────────────────┴──────┘  │
│                                     │
└─────────────────────────────────────┘
```

### Temas (Mobile)

```
┌─────────────────────────────────────┐
│  Meus Temas                         │
│  Organizados automaticamente        │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📁 Tecnologia           ⋮   │   │
│  │                             │   │
│  │ Vídeos sobre tech...        │   │
│  │                             │   │
│  │ 12 vídeos • há 2 dias       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📁 Educação             ⋮   │   │
│  │                             │   │
│  │ Conteúdo educacional...     │   │
│  │                             │   │
│  │ 8 vídeos • há 1 semana      │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📁 Entretenimento       ⋮   │   │
│  │                             │   │
│  │ Vídeos de entretenimento... │   │
│  │                             │   │
│  │ 5 vídeos • há 3 dias        │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

## 🎨 Breakpoints e Transições

### Mobile (< 768px)
```
• Drawer lateral
• Bottom navigation
• Grid 1-2 colunas
• Tipografia reduzida
• Padding compacto
• Thumbnails pequenos
```

### Tablet (768px - 1023px)
```
• Header desktop
• Sem bottom nav
• Grid 2-3 colunas
• Tipografia média
• Padding médio
• Thumbnails médios
```

### Desktop (≥ 1024px)
```
• Header completo
• Sem bottom nav
• Grid 3-4 colunas
• Tipografia completa
• Padding completo
• Thumbnails grandes
```

## 🔄 Fluxo de Navegação

### Usuário Não Logado
```
Home (Landing)
    ↓
Login/Signup
    ↓
Home (Dashboard)
```

### Usuário Logado (Mobile)
```
Bottom Nav:
    ├─ Início → Home Dashboard
    ├─ Temas → Lista de Temas → Detalhes
    ├─ Adicionar → Dialog → Processar
    ├─ Vídeos → Lista → Detalhes
    └─ Favoritos → Lista → Detalhes

Drawer:
    ├─ Navegação (mesmo que bottom)
    ├─ Extensões
    ├─ Perfil
    ├─ Configurações
    └─ Logout
```

## 📊 Hierarquia de Componentes

```
App
├─ Header
│  ├─ MobileNav (Drawer)
│  ├─ Logo
│  ├─ MobileSearch
│  └─ UserMenu
│
├─ Main Content
│  ├─ Home
│  ├─ Themes
│  ├─ Videos
│  ├─ Favorites
│  ├─ Login
│  └─ Signup
│
└─ BottomNav (Mobile only)
   ├─ Home Button
   ├─ Themes Button
   ├─ Add Button (Floating)
   ├─ Videos Button
   └─ Favorites Button
```

## 🎯 Estados dos Componentes

### Bottom Navigation
```
Active:   text-primary
Inactive: text-muted-foreground
Hover:    text-foreground
```

### Drawer
```
Open:   slide-in-from-left
Closed: slide-out-to-left
```

### Cards
```
Default: bg-card
Hover:   bg-accent/50
Active:  border-primary/50
```

## 📱 Gestos e Interações

### Touch
```
Tap:        Selecionar/Abrir
Long Press: Menu de contexto
Swipe:      Scroll (vertical)
```

### Feedback
```
Tap:   -webkit-tap-highlight-color: transparent
Hover: scale(1.01) ou bg-accent
Focus: ring-2 ring-primary
```

---

**Estrutura completa e funcional para experiência mobile nativa!**
