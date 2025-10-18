import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { VideoProgress } from '@/types/database';

interface UseVideosProgressOptions {
  videoIds: string[];
  userId: string | null;
}

interface UseVideosProgressReturn {
  progressMap: Map<string, VideoProgress>;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export function useVideosProgress({
  videoIds,
  userId,
}: UseVideosProgressOptions): UseVideosProgressReturn {
  const [progressMap, setProgressMap] = useState<Map<string, VideoProgress>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const fetchProgress = async () => {
    if (!userId || videoIds.length === 0) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('video_progress')
        .select('*')
        .eq('user_id', userId)
        .in('video_id', videoIds);

      if (error) throw error;

      const newMap = new Map<string, VideoProgress>();
      data?.forEach((progress) => {
        newMap.set(progress.video_id, progress);
      });

      setProgressMap(newMap);
    } catch (error) {
      console.error('Error loading videos progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [userId, videoIds.join(',')]);

  return {
    progressMap,
    isLoading,
    refetch: fetchProgress,
  };
}
