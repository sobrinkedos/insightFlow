# Guia de Teste - Feature de Progresso de Vídeos

## 🧪 Como Testar a Feature

### 1. Preparação do Ambiente

#### Aplicar a Migration

**Opção A: Via Supabase CLI**
```bash
# Se você tem o Supabase CLI instalado
supabase db push
```

**Opção B: Via Dashboard do Supabase**
1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Copie e cole o conteúdo de `supabase/migrations/20241018000000_create_video_progress.sql`
5. Clique em **Run**

#### Verificar se a Tabela foi Criada

```sql
-- Execute no SQL Editor do Supabase
SELECT * FROM video_progress LIMIT 1;
```

### 2. Teste Manual no App

#### Passo 1: Adicionar um Vídeo
1. Faça login no app
2. Compartilhe um vídeo do YouTube
3. Aguarde o processamento

#### Passo 2: Assistir Parcialmente
1. Abra o vídeo na página de detalhes
2. Assista por pelo menos 15-20 segundos
3. Navegue para outra página (o progresso é salvo automaticamente)

#### Passo 3: Verificar o Progresso Salvo

**No Supabase Dashboard:**
```sql
SELECT 
  v.title,
  vp.current_time,
  vp.duration,
  vp.progress_percentage,
  vp.completed,
  vp.last_watched_at
FROM video_progress vp
JOIN videos v ON v.id = vp.video_id
ORDER BY vp.last_watched_at DESC;
```

#### Passo 4: Testar Retomada
1. Volte para a página do vídeo
2. Você deve ver um prompt perguntando se quer continuar de onde parou
3. Clique em "Continuar" - o vídeo deve começar no tempo salvo
4. Ou clique em "Começar do início" - o vídeo começa do zero

#### Passo 5: Verificar Indicador na Lista
1. Vá para a página de vídeos (`/videos`)
2. Você deve ver uma barra de progresso abaixo de cada vídeo assistido
3. A barra mostra a porcentagem assistida

#### Passo 6: Testar Conclusão Automática
1. Assista um vídeo até quase o final (95%+)
2. O sistema deve marcar automaticamente como completo
3. A barra de progresso fica verde
4. Na próxima vez que abrir, não mostra o prompt de retomar

### 3. Testes de Edge Cases

#### Teste 1: Múltiplos Vídeos
- Assista parcialmente 3-4 vídeos diferentes
- Verifique se cada um mantém seu progresso individual
- Confirme que não há conflitos

#### Teste 2: Mesmo Vídeo em Dispositivos Diferentes
- Assista um vídeo no desktop
- Abra o mesmo vídeo no mobile
- O progresso deve ser sincronizado

#### Teste 3: Vídeo Muito Curto
- Teste com um vídeo de menos de 30 segundos
- Verifique se o comportamento é adequado

#### Teste 4: Resetar Progresso
```typescript
// No console do navegador (DevTools)
const { resetProgress } = useVideoProgress({
  videoId: 'VIDEO_ID_AQUI',
  userId: 'USER_ID_AQUI'
});
await resetProgress();
```

### 4. Testes de Performance

#### Verificar Debounce
1. Abra o DevTools (F12)
2. Vá para a aba Network
3. Filtre por "video_progress"
4. Assista um vídeo
5. Confirme que as requisições são feitas a cada ~5 segundos, não constantemente

#### Verificar Carregamento
1. Abra uma lista com muitos vídeos
2. Verifique no Network que apenas uma query é feita para buscar todos os progressos
3. Não deve haver N+1 queries

### 5. Testes de Segurança (RLS)

#### Teste de Isolamento de Usuários
```sql
-- Como admin no Supabase, crie progresso para outro usuário
INSERT INTO video_progress (user_id, video_id, current_time, duration)
VALUES ('outro-user-id', 'video-id', 50, 100);

-- Tente acessar via app com seu usuário
-- Você NÃO deve ver o progresso do outro usuário
```

### 6. Testes Automatizados (Opcional)

#### Teste do Hook

```typescript
// src/hooks/__tests__/use-video-progress.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useVideoProgress } from '../use-video-progress';

describe('useVideoProgress', () => {
  it('should load progress on mount', async () => {
    const { result } = renderHook(() => 
      useVideoProgress({
        videoId: 'test-video-id',
        userId: 'test-user-id'
      })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should update progress', async () => {
    const { result } = renderHook(() => 
      useVideoProgress({
        videoId: 'test-video-id',
        userId: 'test-user-id'
      })
    );

    await result.current.updateProgress(50, 100);

    await waitFor(() => {
      expect(result.current.progress?.current_time).toBe(50);
    });
  });
});
```

## 🐛 Problemas Comuns e Soluções

### Problema: Progresso não salva

**Possíveis causas:**
- Usuário não está autenticado
- Migration não foi aplicada
- RLS bloqueando a operação

**Solução:**
```typescript
// Verificar no console
console.log('User:', user);
console.log('Video ID:', videoId);

// Testar query manual
const { data, error } = await supabase
  .from('video_progress')
  .select('*')
  .eq('user_id', user.id);
console.log('Data:', data, 'Error:', error);
```

### Problema: Prompt não aparece

**Possíveis causas:**
- Vídeo assistido por menos de 10 segundos
- Vídeo já marcado como completo
- Callback `onProgressLoaded` não configurado

**Solução:**
```typescript
// Adicionar logs
onProgressLoaded: (progress) => {
  console.log('Progress loaded:', progress);
  console.log('Should show prompt:', 
    progress && 
    progress.current_time > 10 && 
    !progress.completed
  );
}
```

### Problema: YouTube Player API não funciona

**Possíveis causas:**
- `enablejsapi=1` não está na URL
- Bloqueio de cookies de terceiros
- CORS issues

**Solução:**
```typescript
// Verificar URL do iframe
console.log('Iframe src:', iframeRef.current?.src);

// Deve conter: enablejsapi=1
// Exemplo: https://www.youtube.com/embed/VIDEO_ID?enablejsapi=1
```

## 📊 Métricas para Monitorar

### Queries Úteis

**Taxa de Retomada:**
```sql
SELECT 
  COUNT(*) FILTER (WHERE current_time > 10 AND NOT completed) * 100.0 / 
  COUNT(*) as resume_rate
FROM video_progress;
```

**Tempo Médio Assistido:**
```sql
SELECT 
  AVG(current_time) as avg_watch_time,
  AVG(progress_percentage) as avg_completion
FROM video_progress;
```

**Vídeos Mais Completos:**
```sql
SELECT 
  v.title,
  COUNT(*) FILTER (WHERE vp.completed) as completions,
  AVG(vp.progress_percentage) as avg_progress
FROM video_progress vp
JOIN videos v ON v.id = vp.video_id
GROUP BY v.id, v.title
ORDER BY completions DESC
LIMIT 10;
```

## ✅ Checklist de Testes

- [ ] Migration aplicada com sucesso
- [ ] Tabela `video_progress` existe
- [ ] RLS policies estão ativas
- [ ] Progresso salva automaticamente
- [ ] Prompt de retomar aparece corretamente
- [ ] Botão "Continuar" funciona
- [ ] Botão "Começar do início" funciona
- [ ] Indicador de progresso aparece na lista
- [ ] Vídeos são marcados como completos (95%+)
- [ ] Barra fica verde quando completo
- [ ] Progresso é isolado por usuário
- [ ] Performance adequada (debounce funciona)
- [ ] Sem N+1 queries
- [ ] Funciona em mobile
- [ ] Funciona em diferentes navegadores

## 🎯 Próximos Passos

Após validar todos os testes:

1. **Monitorar em Produção**
   - Configurar alertas para erros
   - Acompanhar métricas de uso
   - Coletar feedback dos usuários

2. **Otimizações**
   - Adicionar cache local (localStorage)
   - Implementar retry logic
   - Melhorar UX do prompt

3. **Features Adicionais**
   - Histórico de visualização
   - Estatísticas pessoais
   - Recomendações baseadas em progresso

---

**Última atualização:** 18/10/2024
