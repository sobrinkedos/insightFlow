import { useState, useRef, useEffect } from "react";
import { Maximize, Minimize, RotateCw, Play, Clock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useVideoProgress } from "@/hooks/use-video-progress";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

// Declarar tipos do YouTube IFrame API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoPlayerProps {
  videoId: string;
  embedUrl: string;
  title?: string;
  className?: string;
}

export function VideoPlayer({ videoId, embedUrl, title, className }: VideoPlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [resumeTime, setResumeTime] = useState<number>(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [manualTime, setManualTime] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  
  const { user } = useAuth();
  const { progress, updateProgress } = useVideoProgress({
    videoId,
    userId: user?.id || null,
    onProgressLoaded: (loadedProgress) => {
      if (loadedProgress && loadedProgress.watched_time > 10 && !loadedProgress.completed) {
        setResumeTime(loadedProgress.watched_time);
        setShowResumePrompt(true);
      }
    },
  });

  // Extrair YouTube video ID da URL
  const getYouTubeVideoId = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts[pathParts.length - 1] || null;
    } catch {
      return null;
    }
  };

  const youtubeVideoId = getYouTubeVideoId(embedUrl);

  // Carregar YouTube IFrame API
  useEffect(() => {
    if (!youtubeVideoId) return;

    // Verificar se a API já está carregada
    if (window.YT && window.YT.Player) {
      initializePlayer();
      return;
    }

    // Carregar script da API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Callback quando a API estiver pronta
    window.onYouTubeIframeAPIReady = () => {
      initializePlayer();
    };

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [youtubeVideoId]);

  const initializePlayer = () => {
    if (!playerContainerRef.current || !youtubeVideoId) return;

    playerRef.current = new window.YT.Player(playerContainerRef.current, {
      videoId: youtubeVideoId,
      playerVars: {
        autoplay: 0,
        rel: 0,
        modestbranding: 1,
        enablejsapi: 1,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  };

  const onPlayerReady = () => {
    setPlayerReady(true);
  };

  const onPlayerStateChange = (event: any) => {
    // 1 = playing
    if (event.data === 1) {
      startProgressTracking();
    } else {
      stopProgressTracking();
    }
  };

  const startProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current && user) {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          
          if (currentTime && duration) {
            updateProgress(currentTime, duration);
          }
        } catch (error) {
          console.error('Error tracking progress:', error);
        }
      }
    }, 5000); // Atualizar a cada 5 segundos
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  useEffect(() => {
    // Detectar mudanças de fullscreen
    const handleFullscreenChange = () => {
      const fullscreenElement = 
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement;
      
      setIsFullscreen(!!fullscreenElement);
    };

    // Detectar mudanças de orientação
    const handleOrientationChange = () => {
      const isNowLandscape = window.innerWidth > window.innerHeight;
      setIsLandscape(isNowLandscape);
    };

    // Adicionar listeners
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    
    window.addEventListener("resize", handleOrientationChange);
    window.addEventListener("orientationchange", handleOrientationChange);
    
    // Verificar estado inicial
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

  const enterFullscreen = async (element: HTMLElement) => {
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).webkitEnterFullscreen) {
        await (element as any).webkitEnterFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        await (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
      }
      return true;
    } catch (err) {
      console.error("Fullscreen request failed:", err);
      return false;
    }
  };

  const exitFullscreen = async () => {
    try {
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
    } catch (err) {
      console.error("Exit fullscreen failed:", err);
    }
  };

  const lockOrientation = async () => {
    // Tentar bloquear orientação após um pequeno delay
    setTimeout(async () => {
      try {
        if (screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock("landscape");
          console.log("✅ Orientation locked to landscape");
        } else if ((screen as any).lockOrientation) {
          (screen as any).lockOrientation("landscape");
          console.log("✅ Orientation locked (webkit)");
        }
      } catch (err) {
        console.log("⚠️ Orientation lock not supported:", err);
      }
    }, 200);
  };

  const unlockOrientation = () => {
    try {
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      } else if ((screen as any).unlockOrientation) {
        (screen as any).unlockOrientation();
      }
    } catch (err) {
      console.log("Orientation unlock not needed");
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      const success = await enterFullscreen(containerRef.current);
      if (success) {
        await lockOrientation();
      }
    } else {
      await exitFullscreen();
      unlockOrientation();
    }
  };

  const handleResumeVideo = () => {
    setShowResumePrompt(false);
    if (playerRef.current && playerReady) {
      playerRef.current.seekTo(resumeTime, true);
      playerRef.current.playVideo();
    }
  };

  const handleStartFromBeginning = () => {
    setShowResumePrompt(false);
    if (playerRef.current && playerReady) {
      playerRef.current.seekTo(0, true);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCaptureCurrentTime = () => {
    if (!playerRef.current || !playerReady || !user) {
      toast.error("Player não está pronto ou você não está logado.");
      return;
    }

    try {
      const currentTime = playerRef.current.getCurrentTime();
      const duration = playerRef.current.getDuration();
      
      if (currentTime && duration) {
        const formattedTime = formatTime(currentTime);
        setManualTime(formattedTime);
        toast.success(`Tempo capturado: ${formattedTime}`);
      } else {
        toast.error("Não foi possível capturar o tempo. Tente pausar o vídeo primeiro.");
      }
    } catch (error) {
      console.error('Error capturing time:', error);
      toast.error("Erro ao capturar tempo. Digite manualmente.");
    }
  };

  const handleSaveProgress = () => {
    if (!manualTime || !user) return;

    const parts = manualTime.split(':').map(p => parseInt(p));
    let seconds = 0;
    
    if (parts.length === 2) {
      seconds = parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else {
      toast.error("Formato inválido. Use MM:SS ou HH:MM:SS");
      return;
    }

    const estimatedDuration = progress?.duration || seconds * 2;
    updateProgress(seconds, estimatedDuration);
    toast.success(`Progresso salvo em ${manualTime}`);
    setManualTime("");
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative group bg-black",
        isFullscreen && "!fixed !inset-0 !z-[99999] flex items-center justify-center",
        className
      )}
      style={isFullscreen ? { 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999
      } : undefined}
    >
      <div className={cn(
        "relative w-full",
        isFullscreen ? "h-full" : "aspect-video"
      )}>
        <div
          ref={playerContainerRef}
          className="w-full h-full rounded-md"
          style={isFullscreen ? {
            width: '100%',
            height: '100%',
            borderRadius: 0
          } : undefined}
        />

        {/* Prompt para retomar vídeo */}
        {showResumePrompt && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-30 rounded-md">
            <div className="bg-background border rounded-lg p-6 max-w-md mx-4 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Play className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Continuar assistindo?</h3>
                  <p className="text-sm text-muted-foreground">
                    Você parou em {formatTime(resumeTime)}
                  </p>
                </div>
              </div>
              
              {progress && progress.progress_percentage && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progresso</span>
                    <span>{Math.round(progress.progress_percentage)}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${progress.progress_percentage}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleStartFromBeginning}
                >
                  Começar do início
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleResumeVideo}
                >
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Botão de fullscreen */}
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "absolute bottom-4 right-4 z-20 shadow-lg",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            "touch-none pointer-events-auto",
            isFullscreen && "!opacity-100"
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

      {/* Controle manual de progresso */}
      {!isFullscreen && user && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Ex: 5:30 ou 1:05:30"
              value={manualTime}
              onChange={(e) => setManualTime(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && manualTime) {
                  handleSaveProgress();
                }
              }}
              className="flex-1 px-3 py-1.5 text-sm bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleCaptureCurrentTime}
              disabled={!playerReady}
              title="Capturar tempo atual do vídeo automaticamente"
            >
              <Save className="h-4 w-4 mr-1" />
              Capturar
            </Button>
            <Button
              size="sm"
              onClick={handleSaveProgress}
              disabled={!manualTime}
            >
              Salvar
            </Button>
          </div>
          <p className="text-xs text-muted-foreground px-3">
            {playerReady ? (
              <>💡 Dica: Pause o vídeo e clique em "Capturar" para pegar o tempo automaticamente</>
            ) : (
              <>⏳ Aguardando player carregar...</>
            )}
          </p>
        </div>
      )}

      {/* Mensagem de orientação */}
      {isFullscreen && !isLandscape && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 animate-pulse">
          <div className="bg-black/90 text-white text-sm px-4 py-3 rounded-full backdrop-blur-sm border border-white/30 flex items-center gap-2 shadow-lg">
            <RotateCw className="h-4 w-4" />
            <span>Vire o celular para melhor visualização</span>
          </div>
        </div>
      )}
    </div>
  );
}
