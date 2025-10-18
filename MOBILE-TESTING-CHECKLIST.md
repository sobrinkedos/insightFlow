# Checklist de Testes Mobile

## 🧪 Testes de Funcionalidade

### Navegação

#### Barra Inferior (Mobile)
- [ ] Botão "Início" navega para home
- [ ] Botão "Temas" navega para temas
- [ ] Botão "+" abre dialog de compartilhar vídeo
- [ ] Botão "Vídeos" navega para vídeos
- [ ] Botão "Favoritos" navega para favoritos
- [ ] Ícones destacam quando página está ativa
- [ ] Barra permanece fixa ao rolar a página
- [ ] Barra só aparece quando usuário está logado

#### Menu Lateral (Drawer)
- [ ] Abre ao clicar no ícone hambúrguer
- [ ] Mostra avatar e email do usuário
- [ ] Todos os links de navegação funcionam
- [ ] Fecha ao clicar em um link
- [ ] Fecha ao clicar fora do drawer
- [ ] Botão de tema alterna entre claro/escuro
- [ ] Botão de logout funciona corretamente
- [ ] Animação de abertura/fechamento suave

#### Header
- [ ] Logo clicável retorna à home
- [ ] Menu hambúrguer visível apenas em mobile
- [ ] Busca mobile funciona (ícone de lupa)
- [ ] Avatar do usuário acessível
- [ ] Botões de login/cadastro visíveis quando não logado

### Páginas

#### Home
- [ ] Cards de estatísticas em grid 2x2 (mobile)
- [ ] Cards de estatísticas em grid 1x4 (desktop)
- [ ] Banner de extensões responsivo
- [ ] Temas em destaque em grid adaptativo
- [ ] Lista de vídeos recentes legível
- [ ] Sidebar de favoritos e top temas (desktop)
- [ ] Scroll suave em todas as seções

#### Temas
- [ ] Grid 1 coluna em mobile
- [ ] Grid 2-3 colunas em desktop
- [ ] Cards clicáveis levam aos detalhes
- [ ] Menu de ações (⋮) funciona
- [ ] Informações visíveis e legíveis
- [ ] Loading states funcionam

#### Vídeos
- [ ] Lista vertical otimizada
- [ ] Thumbnails carregam corretamente
- [ ] Botão de favorito funciona
- [ ] Menu de ações funciona
- [ ] Tabs responsivas
- [ ] Filtros acessíveis
- [ ] Status dos vídeos visível

#### Favoritos
- [ ] Lista similar a vídeos
- [ ] Botão de desfavoritar funciona
- [ ] Empty state quando não há favoritos
- [ ] Navegação para detalhes funciona

#### Login/Signup
- [ ] Formulários centralizados
- [ ] Campos de input acessíveis
- [ ] Validação funciona
- [ ] Mensagens de erro visíveis
- [ ] Links entre login/signup funcionam
- [ ] Animações suaves

### Componentes

#### ShareVideoDialog
- [ ] Abre via botão do header (desktop)
- [ ] Abre via botão central da barra inferior (mobile)
- [ ] Formulário funciona corretamente
- [ ] Fecha após submissão
- [ ] Validação de URL funciona

#### MobileSearch
- [ ] Dialog abre ao clicar no ícone
- [ ] Input recebe foco automático
- [ ] Botão de limpar (X) funciona
- [ ] Botão cancelar fecha o dialog
- [ ] Pesquisa funciona (quando implementada)

## 📱 Testes de Responsividade

### Breakpoints
- [ ] 375px (iPhone SE) - Layout mobile
- [ ] 390px (iPhone 12/13/14) - Layout mobile
- [ ] 430px (iPhone 14 Pro Max) - Layout mobile
- [ ] 768px (iPad Mini) - Transição mobile→desktop
- [ ] 1024px (iPad Pro) - Layout desktop
- [ ] 1440px (Desktop) - Layout desktop completo

### Orientação
- [ ] Portrait (vertical) funciona corretamente
- [ ] Landscape (horizontal) funciona corretamente
- [ ] Rotação não quebra layout
- [ ] Barra inferior se adapta

## 🎨 Testes Visuais

### Tipografia
- [ ] Textos legíveis em mobile
- [ ] Hierarquia visual clara
- [ ] Sem overflow de texto
- [ ] Line-height adequado

### Espaçamento
- [ ] Padding adequado em mobile
- [ ] Gaps entre elementos suficientes
- [ ] Não há elementos colados
- [ ] Margens consistentes

### Cores e Contraste
- [ ] Contraste adequado (WCAG AA)
- [ ] Tema escuro funciona
- [ ] Tema claro funciona
- [ ] Cores de status visíveis

### Imagens
- [ ] Thumbnails carregam
- [ ] Imagens não distorcem
- [ ] Fallback funciona
- [ ] Lazy loading funciona

## 👆 Testes de Interação

### Touch
- [ ] Botões respondem ao toque
- [ ] Área de toque ≥ 44x44px
- [ ] Sem highlight azul ao tocar
- [ ] Feedback visual ao tocar
- [ ] Scroll suave com dedo

### Gestos
- [ ] Scroll vertical funciona
- [ ] Scroll horizontal bloqueado
- [ ] Pull-to-refresh (se implementado)
- [ ] Swipe (se implementado)

### Performance
- [ ] Animações suaves (60fps)
- [ ] Sem lag ao navegar
- [ ] Transições rápidas
- [ ] Loading states adequados

## ♿ Testes de Acessibilidade

### Navegação por Teclado
- [ ] Tab navega entre elementos
- [ ] Enter ativa botões/links
- [ ] Escape fecha modals
- [ ] Focus visível

### Screen Readers
- [ ] Labels adequados
- [ ] Alt text em imagens
- [ ] ARIA labels presentes
- [ ] Ordem de leitura lógica

### Zoom
- [ ] Zoom 200% funciona
- [ ] Layout não quebra
- [ ] Textos legíveis
- [ ] Botões acessíveis

## 🔧 Testes Técnicos

### Console
- [ ] Sem erros no console
- [ ] Sem warnings críticos
- [ ] Sem memory leaks
- [ ] Requests otimizados

### Network
- [ ] Imagens otimizadas
- [ ] Lazy loading funciona
- [ ] Cache funciona
- [ ] Offline (se PWA)

### Performance
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Lighthouse score > 90

## 🌐 Testes de Navegadores

### Mobile
- [ ] Safari iOS
- [ ] Chrome Android
- [ ] Firefox Android
- [ ] Samsung Internet

### Desktop
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## 📊 Relatório de Testes

### Dispositivos Testados
| Dispositivo | Resolução | Status | Observações |
|-------------|-----------|--------|-------------|
| iPhone SE   | 375x667   | ⬜     |             |
| iPhone 14   | 390x844   | ⬜     |             |
| iPad Mini   | 768x1024  | ⬜     |             |
| Desktop     | 1920x1080 | ⬜     |             |

### Navegadores Testados
| Navegador | Versão | Status | Observações |
|-----------|--------|--------|-------------|
| Chrome    |        | ⬜     |             |
| Safari    |        | ⬜     |             |
| Firefox   |        | ⬜     |             |
| Edge      |        | ⬜     |             |

### Issues Encontrados
| # | Descrição | Severidade | Status |
|---|-----------|------------|--------|
| 1 |           |            | ⬜     |
| 2 |           |            | ⬜     |
| 3 |           |            | ⬜     |

---

**Legenda**:
- ⬜ Não testado
- ✅ Passou
- ❌ Falhou
- ⚠️ Atenção necessária

**Severidade**:
- 🔴 Crítico
- 🟡 Médio
- 🟢 Baixo
