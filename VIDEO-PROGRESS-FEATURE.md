# Feature: Controle de Progresso de Vídeos

## 📋 Visão Geral

Esta feature permite que os usuários:
- **Salvem automaticamente** o progresso de visualização dos vídeos
- **Retomem de onde pararam** ao voltar a assistir um vídeo
- **Vejam o progresso** em listas de vídeos
- **Marquem vídeos como completos** automaticamente

## 🗄️ Estrutura do Banco de Dados

### Tabela: `video_progress`

```sql
- id: UUID (PK)
- user_id: UUID (FK -> auth.users)
- video_id: UUID (FK -> videos)
- current_time: NUMERIC (tempo em segundos)
- duration: NUMERIC (duração total em segundos)
- progress_percentage: NUMERIC (calculado automaticamente)
- completed: BOOLEAN
- last_watched_at: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**Características:**
- Constraint UNIQUE em (user_id, video_id)
- RLS habilitado para segurança
- Índices otimizados para queries
- Trigger automático para updated_at

## 🚀 Como Usar

### 1. Aplicar a Migration

```bash
# Se estiver usando Supabase CLI
supabase db push

# Ou aplique manualmente via Dashboard do Supabase
# Copie o conteúdo de: supabase/migrations/20241018000000_create_video_progress.sql
```

### 2. Usar o Hook `useVideoProgress`

```typescript
import { useVideoProgress } from '@/hooks/use-video-progress';
import { useAuth } from '@/contexts/auth-context';

function MyVideoComponent({ videoId }: { videoId: string }) {
  const { user } = useAuth();
  
  const { 
    progress,           // Progresso atual
    isLoading,          // Estado de carregamento
    updateProgress,     // Atualizar progresso
    markAsCompleted,    // Marcar como completo
    resetProgress       // Resetar progresso
  } = useVideoProgress({
    videoId,
    userId: user?.id || null,
    onProgressLoaded: (progress) => {
      console.log('Progresso carregado:', progress);
    }
  });

  // Atualizar progresso (com debounce automático)
  const handleTimeUpdate = (currentTime: number, duration: number) => {
    updateProgress(currentTime, duration);
  };

  return (
    <div>
      {progress && (
        <p>Progresso: {Math.round(progress.progress_percentage || 0)}%</p>
      )}
    </div>
  );
}
```

### 3. Usar o Hook `useVideosProgress` (para listas)

```typescript
import { useVideosProgress } from '@/hooks/use-videos-progress';

function VideoList({ videos }: { videos: Video[] }) {
  const { user } = useAuth();
  
  const { progressMap, isLoading } = useVideosProgress({
    videoIds: videos.map(v => v.id),
    userId: user?.id || null,
  });

  return (
    <div>
      {videos.map(video => {
        const progress = progressMap.get(video.id);
        return (
          <div key={video.id}>
            <h3>{video.title}</h3>
            {progress && (
              <p>Progresso: {Math.round(progress.progress_percentage || 0)}%</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

### 4. Usar o Componente `VideoProgressIndicator`

```typescript
import { VideoProgressIndicator } from '@/components/video-progress-indicator';

function VideoCard({ video, progress }: Props) {
  return (
    <div>
      <h3>{video.title}</h3>
      <VideoProgressIndicator 
        progress={progress}
        showLabel={true}  // Mostrar texto "Completo" ou "Em progresso"
      />
    </div>
  );
}
```

## 🎬 VideoPlayer Atualizado

O componente `VideoPlayer` agora:

1. **Salva automaticamente** o progresso a cada 5 segundos
2. **Mostra um prompt** para retomar de onde parou
3. **Marca como completo** quando atinge 95% do vídeo
4. **Integra com YouTube Player API** via postMessage

### Props do VideoPlayer

```typescript
interface VideoPlayerProps {
  videoId: string;      // ID do vídeo no banco (NOVO)
  embedUrl: string;     // URL do embed do YouTube
  title?: string;       // Título do vídeo
  className?: string;   // Classes CSS customizadas
}
```

### Exemplo de Uso

```typescript
<VideoPlayer 
  videoId={video.id}
  embedUrl="https://www.youtube.com/embed/VIDEO_ID"
  title="Meu Vídeo"
/>
```

## ⚙️ Configurações

### Constantes Ajustáveis

No arquivo `src/hooks/use-video-progress.ts`:

```typescript
const SAVE_INTERVAL = 5000;           // Intervalo de salvamento (ms)
const COMPLETION_THRESHOLD = 0.95;    // 95% = completo
```

## 🔒 Segurança (RLS)

As políticas de Row Level Security garantem que:
- Usuários só veem seu próprio progresso
- Usuários só podem modificar seu próprio progresso
- Todas as operações são isoladas por usuário

## 📊 Queries Úteis

### Ver progresso de um usuário

```sql
SELECT 
  v.title,
  vp.progress_percentage,
  vp.completed,
  vp.last_watched_at
FROM video_progress vp
JOIN videos v ON v.id = vp.video_id
WHERE vp.user_id = 'USER_ID'
ORDER BY vp.last_watched_at DESC;
```

### Vídeos mais assistidos

```sql
SELECT 
  v.title,
  COUNT(*) as views,
  AVG(vp.progress_percentage) as avg_progress
FROM video_progress vp
JOIN videos v ON v.id = vp.video_id
GROUP BY v.id, v.title
ORDER BY views DESC;
```

### Taxa de conclusão

```sql
SELECT 
  COUNT(*) FILTER (WHERE completed = true) * 100.0 / COUNT(*) as completion_rate
FROM video_progress
WHERE user_id = 'USER_ID';
```

## 🎨 Customização

### Alterar cores do indicador de progresso

No arquivo `src/components/video-progress-indicator.tsx`:

```typescript
// Vídeo completo (verde)
className={cn(
  "h-full transition-all duration-300",
  isCompleted ? "bg-green-500" : "bg-primary"  // Altere aqui
)}
```

### Alterar threshold de conclusão

```typescript
// 90% ao invés de 95%
const COMPLETION_THRESHOLD = 0.90;
```

## 🐛 Troubleshooting

### Progresso não está salvando

1. Verifique se o usuário está autenticado
2. Confirme que a migration foi aplicada
3. Verifique as políticas RLS no Supabase Dashboard
4. Veja o console do navegador para erros

### YouTube Player API não funciona

1. Certifique-se de que `enablejsapi=1` está na URL do embed
2. Verifique se o domínio está permitido no YouTube
3. Teste em uma aba anônima (pode ser bloqueio de cookies)

### Prompt de retomar não aparece

1. O vídeo precisa ter mais de 10 segundos assistidos
2. O vídeo não pode estar marcado como completo
3. Verifique se `onProgressLoaded` está sendo chamado

## 📈 Melhorias Futuras

- [ ] Sincronização entre dispositivos em tempo real
- [ ] Estatísticas de visualização
- [ ] Recomendações baseadas em progresso
- [ ] Notificações de vídeos não finalizados
- [ ] Exportar histórico de visualização
- [ ] Suporte para outros players (Vimeo, etc)

## 🤝 Contribuindo

Para adicionar suporte a outras plataformas de vídeo:

1. Estenda o `VideoPlayer` para detectar a plataforma
2. Implemente listeners específicos da plataforma
3. Mantenha a interface do hook `useVideoProgress` consistente

---

**Criado em:** 18/10/2024  
**Versão:** 1.0.0
