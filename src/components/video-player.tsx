import { useState, useRef, useEffect } from "react";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  embedUrl: string;
  title?: string;
  className?: string;
}

export function VideoPlayer({ embedUrl, title, className }: VideoPlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        // Entrar em fullscreen
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen();
        } else if ((containerRef.current as any).mozRequestFullScreen) {
          await (containerRef.current as any).mozRequestFullScreen();
        } else if ((containerRef.current as any).msRequestFullscreen) {
          await (containerRef.current as any).msRequestFullscreen();
        }

        // Tentar bloquear orientação em landscape (apenas em mobile)
        if (screen.orientation && screen.orientation.lock) {
          try {
            await screen.orientation.lock("landscape");
          } catch (err) {
            // Ignorar erro se não suportado
            console.log("Screen orientation lock not supported");
          }
        }
      } else {
        // Sair de fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }

        // Desbloquear orientação
        if (screen.orientation && screen.orientation.unlock) {
          try {
            screen.orientation.unlock();
          } catch (err) {
            console.log("Screen orientation unlock not supported");
          }
        }
      }
    } catch (err) {
      console.error("Error toggling fullscreen:", err);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative group",
        isFullscreen && "fixed inset-0 z-[9999] bg-black flex items-center justify-center",
        className
      )}
    >
      <div className={cn(
        "relative w-full",
        isFullscreen ? "h-full" : "aspect-video"
      )}>
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={title || "Video player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="w-full h-full rounded-md"
        />
        
        {/* Botão de fullscreen */}
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10",
            "md:opacity-100",
            isFullscreen && "opacity-100"
          )}
          onClick={toggleFullscreen}
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Instruções em fullscreen mobile */}
      {isFullscreen && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 md:hidden">
          <div className="bg-black/80 text-white text-xs px-3 py-2 rounded-full backdrop-blur-sm">
            Vire o celular para melhor visualização
          </div>
        </div>
      )}
    </div>
  );
}
