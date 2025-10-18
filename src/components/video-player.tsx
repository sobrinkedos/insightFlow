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
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      
      // Se saiu do fullscreen, desbloquear orientação
      if (!isNowFullscreen && screen.orientation && screen.orientation.unlock) {
        try {
          screen.orientation.unlock();
        } catch (err) {
          console.log("Orientation unlock not supported");
        }
      }
    };

    const handleOrientationChange = () => {
      if (window.innerWidth > window.innerHeight) {
        setOrientation("landscape");
      } else {
        setOrientation("portrait");
      }
    };

    // Listeners de fullscreen
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    // Listeners de orientação
    window.addEventListener("resize", handleOrientationChange);
    window.addEventListener("orientationchange", handleOrientationChange);
    
    // Verificar orientação inicial
    handleOrientationChange();

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
      window.removeEventListener("resize", handleOrientationChange);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        // Entrar em fullscreen
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen({ navigationUI: "hide" } as any);
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen();
        } else if ((containerRef.current as any).webkitEnterFullscreen) {
          await (containerRef.current as any).webkitEnterFullscreen();
        } else if ((containerRef.current as any).mozRequestFullScreen) {
          await (containerRef.current as any).mozRequestFullScreen();
        } else if ((containerRef.current as any).msRequestFullscreen) {
          await (containerRef.current as any).msRequestFullscreen();
        }

        // Tentar bloquear orientação em landscape
        setTimeout(async () => {
          if (screen.orientation && screen.orientation.lock) {
            try {
              await screen.orientation.lock("landscape");
              console.log("Orientation locked to landscape");
            } catch (err) {
              console.log("Screen orientation lock not supported:", err);
            }
          }
          
          // Fallback: tentar com webkit
          if ((screen as any).lockOrientation) {
            try {
              (screen as any).lockOrientation("landscape");
            } catch (err) {
              console.log("Webkit orientation lock not supported");
            }
          }
        }, 100);
      } else {
        // Sair de fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).webkitCancelFullScreen) {
          await (document as any).webkitCancelFullScreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
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
          src={`${embedUrl}?enablejsapi=1&playsinline=1&rel=0`}
          title={title || "Video player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; web-share"
          allowFullScreen
          className={cn(
            "w-full h-full",
            isFullscreen ? "rounded-none" : "rounded-md"
          )}
        />
        
        {/* Botão de fullscreen customizado */}
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "absolute bottom-4 right-4 transition-opacity z-10 shadow-lg",
            "opacity-0 group-hover:opacity-100",
            "md:opacity-100",
            isFullscreen && "opacity-100"
          )}
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Instruções em fullscreen mobile */}
      {isFullscreen && orientation === "portrait" && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 md:hidden animate-pulse">
          <div className="bg-black/90 text-white text-xs px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
            🔄 Vire o celular para melhor visualização
          </div>
        </div>
      )}
    </div>
  );
}
