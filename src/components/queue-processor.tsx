import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

/**
 * Componente que monitora a fila de vídeos e dispara o processamento automaticamente
 * Deve ser incluído no layout principal da aplicação
 */
export function QueueProcessor() {
  const isProcessingRef = useRef(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkAndProcessQueue = async () => {
      // Evitar múltiplas chamadas simultâneas
      if (isProcessingRef.current) {
        return;
      }

      try {
        isProcessingRef.current = true;

        // 1. Resetar vídeos travados (há mais de 10 minutos em processing)
        const { error: resetError } = await supabase.rpc("reset_stuck_videos");
        if (resetError) {
          console.error("⚠️ Erro ao resetar vídeos travados:", resetError);
        }

        // 2. Verificar se há vídeos pendentes
        const { data: pendingVideos, error: checkError } = await supabase
          .from("video_queue")
          .select("id, platform")
          .eq("status", "pending")
          .limit(1);

        if (checkError) {
          console.error("❌ Erro ao verificar fila:", checkError);
          return;
        }

        // 3. Se há vídeos pendentes, disparar processamento
        if (pendingVideos && pendingVideos.length > 0) {
          console.log("📬 Vídeos pendentes encontrados, disparando processamento...");

          const { error: invokeError } = await supabase.functions.invoke(
            "process-video-queue",
            { body: {} }
          );

          if (invokeError) {
            console.error("❌ Erro ao disparar fila:", invokeError);
            // Não bloquear, tentar novamente no próximo ciclo
          } else {
            console.log("✅ Fila disparada com sucesso");
          }
        }
      } catch (error) {
        console.error("❌ Erro no processamento da fila:", error);
      } finally {
        isProcessingRef.current = false;
      }
    };

    // Verificar imediatamente ao montar
    checkAndProcessQueue();

    // Verificar a cada 15 segundos
    interval = setInterval(checkAndProcessQueue, 15000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  // Componente invisível, não renderiza nada
  return null;
}
