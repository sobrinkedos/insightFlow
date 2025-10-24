import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Hook para processar compartilhamento automático de vídeos no mobile/PWA
 * Detecta URL no localStorage e processa automaticamente em background
 */
export function useAutoShare() {
  const { user } = useAuth();
  const processedRef = useRef(false);

  useEffect(() => {
    // Só executar uma vez
    if (processedRef.current || !user) {
      return;
    }

    const processShare = async () => {
      const sharedUrl = localStorage.getItem('sharedVideoUrl');
      const sharedTitle = localStorage.getItem('sharedVideoTitle');

      if (!sharedUrl) {
        console.log('ℹ️ [AUTO-SHARE] No shared URL found');
        return;
      }

      console.log('🚀 [AUTO-SHARE] Processing shared video:', sharedUrl);
      processedRef.current = true;

      // Limpar localStorage imediatamente para evitar reprocessamento
      localStorage.removeItem('sharedVideoUrl');
      localStorage.removeItem('sharedVideoTitle');

      try {
        // Detectar plataforma
        const platform = detectPlatform(sharedUrl);
        console.log('🔍 [AUTO-SHARE] Platform detected:', platform);

        // Limpar URL do Instagram
        const cleanUrl = platform === 'instagram' ? cleanInstagramUrl(sharedUrl) : sharedUrl;

        // Mostrar toast de início
        toast.loading('Adicionando vídeo à fila...', { id: 'auto-share' });

        // 1. Inserir vídeo
        const { data: newVideo, error: insertError } = await supabase
          .from('videos')
          .insert({
            url: cleanUrl,
            user_id: user.id,
            status: 'Na fila',
          })
          .select('id')
          .single();

        if (insertError || !newVideo) {
          console.error('❌ [AUTO-SHARE] Error inserting video:', insertError);
          toast.error('Falha ao adicionar vídeo', { id: 'auto-share' });
          return;
        }

        console.log('✅ [AUTO-SHARE] Video inserted:', newVideo.id);

        // 2. Adicionar à fila
        const { data: queueItem, error: queueError } = await supabase
          .from('video_queue')
          .insert({
            video_id: newVideo.id,
            user_id: user.id,
            status: 'pending',
            platform: platform,
          })
          .select('id')
          .single();

        if (queueError || !queueItem) {
          console.error('❌ [AUTO-SHARE] Error adding to queue:', queueError);
          // Limpar vídeo criado
          await supabase.from('videos').delete().eq('id', newVideo.id);
          toast.error('Falha ao adicionar à fila', { id: 'auto-share' });
          return;
        }

        console.log('✅ [AUTO-SHARE] Added to queue:', queueItem.id);

        // 3. Obter posição na fila
        const { data: positionData } = await supabase.rpc('get_queue_position', {
          p_video_id: newVideo.id,
        });

        const position = positionData || 1;

        // 4. Mostrar sucesso
        if (position === 1) {
          toast.success('Vídeo adicionado! Processamento iniciando...', {
            id: 'auto-share',
            description: sharedTitle || 'Você pode acompanhar o progresso na lista de vídeos',
            duration: 5000,
          });
        } else {
          toast.success(`Vídeo adicionado à fila! Posição: ${position}`, {
            id: 'auto-share',
            description: sharedTitle || 'Você pode acompanhar o progresso na lista de vídeos',
            duration: 5000,
          });
        }

        // 5. Disparar processamento da fila
        console.log('🚀 [AUTO-SHARE] Triggering queue processor...');
        supabase.functions
          .invoke('process-video-queue', { body: {} })
          .then(() => console.log('✅ [AUTO-SHARE] Queue processor triggered'))
          .catch((err) => console.error('❌ [AUTO-SHARE] Queue processor error:', err));
      } catch (error) {
        console.error('❌ [AUTO-SHARE] Unexpected error:', error);
        toast.error('Erro ao processar compartilhamento', { id: 'auto-share' });
      }
    };

    // Pequeno delay para garantir que tudo está carregado
    const timer = setTimeout(processShare, 500);
    return () => clearTimeout(timer);
  }, [user]);
}

// Helper functions
function detectPlatform(url: string): 'youtube' | 'instagram' | 'other' {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      return 'youtube';
    }
    if (urlObj.hostname.includes('instagram.com')) {
      return 'instagram';
    }
    return 'other';
  } catch {
    return 'other';
  }
}

function cleanInstagramUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('instagram.com')) {
      const match = urlObj.pathname.match(/(\/(?:p|reel|tv)\/[^\/\?]+)/);
      if (match) {
        return `https://www.instagram.com${match[1]}/`;
      }
    }
    return url;
  } catch {
    return url;
  }
}
