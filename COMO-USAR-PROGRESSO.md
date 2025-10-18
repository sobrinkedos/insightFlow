# 📹 Como Usar o Controle de Progresso de Vídeos

## 🎯 Visão Geral

O sistema agora possui **duas versões** do player de vídeo:

1. **VideoPlayerSimple** (Ativo) - Com controle manual de progresso
2. **VideoPlayer** (Experimental) - Com YouTube IFrame API automática

## 🚀 Versão Atual: VideoPlayerSimple

### Como Funciona

#### 1. Salvamento de Progresso

Você tem **duas opções** para salvar onde parou:

**Opção A: Captura Automática (Recomendado)**
1. Pause o vídeo no YouTube
2. Clique no botão "Capturar" abaixo do player
3. O tempo é capturado automaticamente e aparece no campo
4. Clique em "Salvar" para confirmar
5. Pronto! ✅

*Nota: Se a captura automática não funcionar, você pode digitar manualmente*

**Opção B: Digite Manualmente**
1. Pause o vídeo no YouTube
2. Anote o tempo atual (ex: 5:30)
3. Digite o tempo no campo abaixo do player
4. Clique em "Salvar" ou pressione Enter

**Formatos aceitos:**
- `MM:SS` - Exemplo: `5:30` (5 minutos e 30 segundos)
- `HH:MM:SS` - Exemplo: `1:05:30` (1 hora, 5 minutos e 30 segundos)

#### 2. Retomar de Onde Parou

Quando você voltar para assistir o vídeo:

1. Um prompt aparecerá automaticamente
2. Mostra onde você parou (ex: "Você parou em 5:30")
3. Mostra a barra de progresso visual
4. Você pode escolher:
   - **Continuar** - O vídeo começa de onde parou
   - **Começar do início** - O vídeo começa do zero

#### 3. Visualizar Progresso nas Listas

Na página de vídeos (`/videos`):
- Cada vídeo mostra uma barra de progresso
- Verde = Vídeo completo (95%+)
- Azul = Em progresso
- Sem barra = Não assistido

## 📱 Exemplo de Uso

### Cenário 1: Assistir um Vídeo Longo (Captura Automática)

```
1. Abra o vídeo
2. Assista até onde quiser
3. Precisa parar? Pause o vídeo
4. Clique em "Capturar"
5. O tempo aparece automaticamente no campo (ex: 15:30)
6. Clique em "Salvar"
7. Pronto! Progresso salvo
8. Volte depois e clique em "Continuar"
9. O vídeo começa exatamente onde você parou
```

### Cenário 1B: Assistir um Vídeo Longo (Manual)

```
1. Abra o vídeo
2. Assista até 15:30
3. Precisa parar? Digite "15:30" e clique em "Salvar"
4. Volte depois
5. Clique em "Continuar" no prompt
6. O vídeo começa em 15:30 automaticamente
```

### Cenário 2: Marcar Como Completo

```
1. Assistiu o vídeo todo?
2. Digite o tempo final (ex: "45:00")
3. Salve o progresso
4. O sistema marca automaticamente como completo (95%+)
5. A barra fica verde nas listas
```

### Cenário 3: Múltiplos Vídeos

```
1. Assista vários vídeos parcialmente
2. Salve o progresso de cada um
3. Na página de vídeos, veja o progresso de todos
4. Continue de onde parou em qualquer um
```

## 🎨 Interface

### Player de Vídeo

```
┌─────────────────────────────────────┐
│                                     │
│         [Vídeo do YouTube]          │
│                                     │
│                          [🔲]       │ ← Fullscreen
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ 🕐 [5:30    ] [💾 Capturar] [Salvar]│ ← Controle
│ 💡 Dica: Clique em "Capturar" para  │
│    pegar o tempo atual automaticam. │
└─────────────────────────────────────┘
```

### Prompt de Retomada

```
┌─────────────────────────────────────┐
│  ▶️  Continuar assistindo?          │
│      Você parou em 5:30             │
│                                     │
│  Progresso                    45%   │
│  ████████████░░░░░░░░░░░░░░░       │
│                                     │
│  [Começar do início]  [Continuar]  │
└─────────────────────────────────────┘
```

### Lista de Vídeos

```
┌─────────────────────────────────────┐
│ 📹 Título do Vídeo                  │
│ YouTube • há 2 dias                 │
│ ████████████░░░░░░░░░░░░░░░  45%   │ ← Barra de progresso
└─────────────────────────────────────┘
```

## 🔧 Dicas e Truques

### Dica 1: Use o Botão Capturar
- **Automático**: Pega o tempo do player
- **Mais rápido**: Um clique e pronto
- **Mais preciso**: Tempo exato do vídeo
- Pause o vídeo antes de capturar

### Dica 2: Atalho de Teclado
- Digite o tempo e pressione **Enter** para salvar
- Use os controles nativos do YouTube (espaço, setas, etc)

### Dica 3: Precisão Manual
- Se digitar manualmente, seja preciso
- Use o formato correto (MM:SS ou HH:MM:SS)
- O sistema valida automaticamente

### Dica 4: Sincronização
- O progresso é salvo no banco de dados
- Funciona em qualquer dispositivo
- Basta fazer login com a mesma conta

### Dica 5: Vídeos Completos
- Não precisa salvar manualmente quando terminar
- Salve em 95%+ do vídeo
- O sistema marca como completo automaticamente

## ⚠️ Limitações Atuais

### Captura de Tempo
- ✅ Captura automática do player
- ✅ Fallback para digitação manual
- ✅ Você controla quando salvar
- ✅ Confiável e compatível

### Compatibilidade
- ✅ Funciona em todos os navegadores
- ✅ Funciona em mobile e desktop
- ✅ Não depende de APIs externas

## 🔮 Versão Experimental: VideoPlayer

Existe uma versão experimental com salvamento automático usando YouTube IFrame API:

### Como Ativar

Edite `src/pages/video-detail.tsx`:

```typescript
// Trocar de:
import { VideoPlayerSimple } from "@/components/video-player-simple";

// Para:
import { VideoPlayer } from "@/components/video-player";
```

### Recursos Experimentais
- ✅ Salvamento automático a cada 5 segundos
- ✅ Não precisa digitar o tempo manualmente
- ⚠️ Pode não funcionar em todos os casos
- ⚠️ Depende da YouTube IFrame API

## 📊 Dados Salvos

Para cada vídeo, o sistema salva:

```typescript
{
  watched_time: 330,        // 5:30 em segundos
  duration: 2700,           // 45:00 em segundos
  progress_percentage: 12,  // Calculado automaticamente
  completed: false,         // true quando >= 95%
  last_watched_at: "2024-10-18T10:30:00Z"
}
```

## 🔒 Privacidade e Segurança

- ✅ Cada usuário vê apenas seu próprio progresso
- ✅ RLS (Row Level Security) ativo
- ✅ Dados criptografados em trânsito
- ✅ Isolamento completo entre usuários

## 🐛 Solução de Problemas

### Problema: Progresso não salva

**Solução:**
1. Verifique se está logado
2. Digite o tempo no formato correto
3. Clique em "Salvar Progresso"
4. Aguarde a mensagem de confirmação

### Problema: Prompt não aparece

**Solução:**
1. Certifique-se de ter salvado progresso antes
2. O vídeo precisa ter mais de 10 segundos assistidos
3. Não pode estar marcado como completo

### Problema: Tempo incorreto

**Solução:**
1. Verifique o formato (MM:SS ou HH:MM:SS)
2. Use números válidos (ex: 5:30, não 5:90)
3. Salve novamente com o tempo correto

## 📈 Estatísticas

Você pode ver suas estatísticas no Supabase Dashboard:

```sql
-- Seus vídeos em progresso
SELECT 
  v.title,
  vp.progress_percentage,
  vp.last_watched_at
FROM video_progress vp
JOIN videos v ON v.id = vp.video_id
WHERE vp.user_id = 'SEU_USER_ID'
  AND vp.completed = false
ORDER BY vp.last_watched_at DESC;

-- Taxa de conclusão
SELECT 
  COUNT(*) FILTER (WHERE completed) * 100.0 / COUNT(*) as completion_rate
FROM video_progress
WHERE user_id = 'SEU_USER_ID';
```

## 🎓 Melhores Práticas

1. **Salve Regularmente**: Salve o progresso a cada 5-10 minutos
2. **Seja Preciso**: Use o tempo exato mostrado no player
3. **Marque Completos**: Salve no final para marcar como completo
4. **Revise Listas**: Use a página de vídeos para ver seu progresso geral

## 🚀 Próximas Melhorias

- [ ] Salvamento automático mais robusto
- [ ] Suporte para outras plataformas (Vimeo, etc)
- [ ] Estatísticas de visualização
- [ ] Recomendações baseadas em progresso
- [ ] Notificações de vídeos não finalizados

---

**Versão:** 1.1.0  
**Última atualização:** 18/10/2024  
**Status:** ✅ Funcional e Testado
