import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { VideoProgress } from '@/types/database';

interface UseVideoProgressOptions {
  videoId: string;
  userId: string | null;
  onProgressLoaded?: (progress: VideoProgress | null) => void;
}

interface UseVideoProgressReturn {
  progress: VideoProgress | null;
  isLoading: boolean;
  updateProgress: (currentTime: number, duration: number) => Promise<void>;
  markAsCompleted: () => Promise<void>;
  resetProgress: () => Promise<void>;
}

const SAVE_INTERVAL = 5000; // Salvar a cada 5 segundos
const COMPLETION_THRESHOLD = 0.95; // 95% do vídeo = completo

export function useVideoProgress({
  videoId,
  userId,
  onProgressLoaded,
}: UseVideoProgressOptions): UseVideoProgressReturn {
  const [progress, setProgress] = useState<VideoProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedTimeRef = useRef<number>(0);

  // Carregar progresso inicial
  useEffect(() => {
    if (!userId || !videoId) {
      setIsLoading(false);
      return;
    }

    const loadProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('video_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('video_id', videoId)
          .maybeSingle();

        if (error) throw error;

        setProgress(data);
        onProgressLoaded?.(data);
      } catch (error) {
        console.error('Error loading video progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [videoId, userId, onProgressLoaded]);

  // Atualizar progresso (com debounce)
  const updateProgress = useCallback(
    async (currentTime: number, duration: number) => {
      if (!userId || !videoId) return;

      // Evitar salvar se o tempo não mudou significativamente
      if (Math.abs(currentTime - lastSavedTimeRef.current) < 3) {
        return;
      }

      // Limpar timeout anterior
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Agendar salvamento
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const progressPercentage = (currentTime / duration) * 100;
          const isCompleted = progressPercentage >= COMPLETION_THRESHOLD * 100;

          const progressData = {
            user_id: userId,
            video_id: videoId,
            watched_time: currentTime,
            duration: duration,
            completed: isCompleted,
            last_watched_at: new Date().toISOString(),
          };

          const { data, error } = await supabase
            .from('video_progress')
            .upsert(progressData, {
              onConflict: 'user_id,video_id',
            })
            .select()
            .single();

          if (error) throw error;

          setProgress(data);
          lastSavedTimeRef.current = currentTime;
        } catch (error) {
          console.error('Error updating video progress:', error);
        }
      }, SAVE_INTERVAL);
    },
    [userId, videoId]
  );

  // Marcar como completo
  const markAsCompleted = useCallback(async () => {
    if (!userId || !videoId) return;

    try {
      const { data, error } = await supabase
        .from('video_progress')
        .upsert(
          {
            user_id: userId,
            video_id: videoId,
            watched_time: progress?.duration || 0,
            duration: progress?.duration || 0,
            completed: true,
            last_watched_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,video_id',
          }
        )
        .select()
        .single();

      if (error) throw error;

      setProgress(data);
    } catch (error) {
      console.error('Error marking video as completed:', error);
    }
  }, [userId, videoId, progress?.duration]);

  // Resetar progresso
  const resetProgress = useCallback(async () => {
    if (!userId || !videoId) return;

    try {
      const { error } = await supabase
        .from('video_progress')
        .delete()
        .eq('user_id', userId)
        .eq('video_id', videoId);

      if (error) throw error;

      setProgress(null);
      lastSavedTimeRef.current = 0;
    } catch (error) {
      console.error('Error resetting video progress:', error);
    }
  }, [userId, videoId]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    progress,
    isLoading,
    updateProgress,
    markAsCompleted,
    resetProgress,
  };
}
