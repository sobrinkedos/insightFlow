import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useVideoReprocess() {
  const [isReprocessing, setIsReprocessing] = useState(false);

  const reprocessVideo = async (videoId: string) => {
    setIsReprocessing(true);
    
    try {
      // 1. Atualiza o status do vídeo para "Pendente" para reprocessamento
      const { error: updateError } = await supabase
        .from('videos')
        .update({ 
          status: 'Pendente',
          // Limpa os dados antigos para forçar novo processamento
          summary_short: null,
          summary_expanded: null,
          transcription: null,
          keywords: null,
          topics: null,
          tutorial_steps: null,
        })
        .eq('id', videoId);

      if (updateError) {
        throw updateError;
      }

      // 2. Dispara o processamento chamando a edge function de fila
      const { error: queueError } = await supabase.functions.invoke('process-video-queue', {
        body: { manual: true }
      });

      if (queueError) {
        console.error('Erro ao disparar fila:', queueError);
        // Não falha aqui pois o cron job vai pegar o vídeo pendente
      }

      toast.success('Vídeo enviado para reprocessamento', {
        description: 'O processamento pode levar alguns minutos. A página será atualizada automaticamente.',
      });

      // 3. Aguarda um pouco e recarrega a página
      setTimeout(() => {
        window.location.reload();
      }, 2000);

      return true;
    } catch (error) {
      console.error('Erro ao reprocessar vídeo:', error);
      toast.error('Erro ao reprocessar vídeo', {
        description: 'Tente novamente em alguns instantes.',
      });
      return false;
    } finally {
      setIsReprocessing(false);
    }
  };

  return {
    reprocessVideo,
    isReprocessing,
  };
}
