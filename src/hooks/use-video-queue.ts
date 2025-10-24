import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';

export interface QueueItem {
  id: string;
  video_id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  platform: 'youtube' | 'instagram' | 'other' | 'unknown';
  priority: number;
  attempts: number;
  max_attempts: number;
  error_message: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  position?: number;
}

export function useVideoQueue() {
  const { user } = useAuth();
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingCount, setProcessingCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchQueue = async () => {
      const { data, error } = await supabase
        .from('video_queue')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['pending', 'processing'])
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching queue:', error);
        setLoading(false);
        return;
      }

      // Get positions for pending items
      const itemsWithPositions = await Promise.all(
        (data || []).map(async (item) => {
          if (item.status === 'pending') {
            const { data: positionData } = await supabase.rpc('get_queue_position', {
              p_video_id: item.video_id
            });
            return { ...item, position: positionData || 0 };
          }
          return item;
        })
      );

      setQueueItems(itemsWithPositions);
      setProcessingCount(itemsWithPositions.filter(item => item.status === 'processing').length);
      setPendingCount(itemsWithPositions.filter(item => item.status === 'pending').length);
      setLoading(false);
    };

    fetchQueue();

    // Subscribe to queue changes
    const channel = supabase
      .channel('video-queue-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'video_queue',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          console.log('Queue changed, refetching...');
          fetchQueue();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    queueItems,
    loading,
    processingCount,
    pendingCount,
    totalInQueue: queueItems.length,
  };
}
