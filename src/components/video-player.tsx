import { useState, useRef, useEffect } from "react";
import { Maximize, Minimize, RotateCw, Play, Clock, Save, Film } from "lucide-react";
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
  const promptShownRef = useRef(false); // Prevenir múltiplas exibições
  
  const { user } = useAuth();
  const { progress, updateProgress } = useVideoProgress({
    videoId,
    userId: user?.id || null,
    onProgressLoaded: (loadedProgress) => {
      // Só mostrar prompt uma vez
      if (promptShownRef.current) return;
      
      if (loadedProgress && loadedProgress.watched_time > 10 && !loadedProgress.completed) {
        console.log('Mostrando prompt de retomada:', loadedProgress.watched_time);
        setResumeTime(loadedProgress.watched_time);
        setShowResumePrompt(true);
        promptShownRef.current = true;
      }
    },
  });

  // Detectar plataforma e extrair ID
  const detectPlatform = (url: string): { platform: string; id: string | null } => {
    try {
      const urlObj = new URL(url);
      
      // YouTube
      if (urlObj.hostname.includes('youtube.com') || urlObj.pathname.includes('/embed/')) {
        const pathParts = urlObj.pathname.split('/');
        const id = pathParts[pathParts.length - 1] || null;
        return { platform: 'youtube', id };
      }
      
      // Instagram
      if (urlObj.hostname.includes('instagram.com')) {
        const match = urlObj.pathname.match(/\/(p|reel|tv)\/([^\/\?]+)/);
        return { platform: 'instagram', id: match ? match[2] : null };
      }
      
      // TikTok
      if (urlObj.hostname.includes('tiktok.com')) {
        return { platform: 'tiktok', id: null };
      }
      
      // Vimeo
      if (urlObj.hostname.includes('vimeo.com')) {
        const pathParts = urlObj.pathname.split('/');
        return { platform: 'vimeo', id: pathParts[pathParts.length - 1] || null };
      }
      
      return { platform: 'unknown', id: null };
    } catch {
      return { platform: 'unknown', id: null };
    }
  };

  const { platform, id: videoIdFromUrl } = detectPlatform(embedUrl);
  const youtubeVideoId = platform === 'youtube' ? videoIdFromUrl : null;

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
    
    // Evitar criar múltiplos players
    if (playerRef.current) return;

    try {
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
      console.log('✅ Player criado:', playerRef.current);
    } catch (error) {
      console.error('❌ Erro ao criar player:', error);
    }
  };

  const onPlayerReady = (event: any) => {
    console.log('✅ Player pronto!', event.target);
    console.log('Métodos disponíveis:', {
      getCurrentTime: typeof event.target.getCurrentTime,
      getDuration: typeof event.target.getDuration,
      seekTo: typeof event.target.seekTo,
      playVideo: typeof event.target.playVideo,
    });
    
    // Garantir que playerRef aponta para o player correto
    playerRef.current = event.target;
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

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      await enterFullscreen(containerRef.current);
    } else {
      await exitFullscreen();
    }
  };

  const handleResumeVideo = () => {
    console.log('=== handleResumeVideo ===');
    console.log('playerReady:', playerReady);
    console.log('playerRef.current:', playerRef.current);
    console.log('resumeTime:', resumeTime);
    console.log('showResumePrompt antes:', showResumePrompt);
    
    if (!playerReady) {
      console.log('❌ Player não está pronto');
      toast.info("Aguardando player carregar...");
      return;
    }
    
    if (playerRef.current) {
      try {
        console.log('Executando seekTo...');
        playerRef.current.seekTo(resumeTime, true);
        console.log('Executando playVideo...');
        playerRef.current.playVideo();
        console.log('✅ Sucesso! Fechando modal...');
        toast.success(`Retomando em ${formatTime(resumeTime)}`);
        
        // Fechar modal
        setShowResumePrompt(false);
        console.log('setShowResumePrompt(false) chamado');
      } catch (error) {
        console.error('❌ Error resuming video:', error);
        toast.error("Erro ao retomar vídeo. Tente novamente.");
      }
    } else {
      console.log('❌ Player não encontrado');
      toast.error("Player não encontrado.");
    }
  };

  const handleStartFromBeginning = () => {
    if (!playerReady) {
      toast.info("Aguardando player carregar...");
      return;
    }
    
    if (playerRef.current) {
      try {
        playerRef.current.seekTo(0, true);
        playerRef.current.playVideo();
        // Fechar modal apenas após sucesso
        setShowResumePrompt(false);
      } catch (error) {
        console.error('Error starting from beginning:', error);
        toast.error("Erro ao iniciar vídeo.");
      }
    } else {
      toast.error("Player não encontrado.");
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCaptureCurrentTime = () => {
    console.log('=== Capturando tempo ===');
    console.log('playerRef.current:', playerRef.current);
    console.log('playerReady:', playerReady);
    console.log('user:', user);

    if (!user) {
      toast.error("Você precisa estar logado.");
      return;
    }

    if (!playerRef.current) {
      toast.error("Player não encontrado. Aguarde o carregamento.");
      return;
    }

    if (!playerReady) {
      toast.error("Player ainda não está pronto. Aguarde alguns segundos.");
      return;
    }

    try {
      console.log('Tentando getCurrentTime...');
      const currentTime = playerRef.current.getCurrentTime();
      console.log('currentTime:', currentTime);
      
      console.log('Tentando getDuration...');
      const duration = playerRef.current.getDuration();
      console.log('duration:', duration);
      
      if (currentTime !== undefined && currentTime >= 0 && duration && duration > 0) {
        const formattedTime = formatTime(currentTime);
        setManualTime(formattedTime);
        toast.success(`Tempo capturado: ${formattedTime}`);
        console.log('✅ Sucesso! Tempo:', formattedTime);
      } else {
        console.log('❌ Valores inválidos:', { currentTime, duration });
        toast.error("Não foi possível capturar o tempo. Tente pausar o vídeo primeiro.");
      }
    } catch (error) {
      console.error('❌ Erro ao capturar:', error);
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
        {platform === 'youtube' ? (
          <div
            ref={playerContainerRef}
            className="w-full h-full rounded-md"
            style={isFullscreen ? {
              width: '100%',
              height: '100%',
              borderRadius: 0
            } : undefined}
          />
        ) : platform === 'instagram' ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-md">
            <div className="text-center p-8 bg-black/50 backdrop-blur-sm rounded-lg max-w-md mx-4">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Vídeo do Instagram</h3>
              <p className="text-white/90 mb-4 text-sm">
                O Instagram não permite incorporar vídeos diretamente. Clique no botão abaixo para assistir no Instagram.
              </p>
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Abrir no Instagram
              </a>
            </div>
          </div>
        ) : platform === 'vimeo' && videoIdFromUrl ? (
          <iframe
            src={`https://player.vimeo.com/video/${videoIdFromUrl}`}
            className="w-full h-full rounded-md"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={title}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted rounded-md">
            <div className="text-center p-8">
              <Film className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Plataforma não suportada</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Esta plataforma ainda não tem suporte para reprodução incorporada.
              </p>
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Abrir vídeo original
              </a>
            </div>
          </div>
        )}

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
                  disabled={!playerReady}
                >
                  Começar do início
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleResumeVideo}
                  disabled={!playerReady}
                >
                  {playerReady ? 'Continuar' : 'Carregando...'}
                </Button>
              </div>
              {!playerReady && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  ⏳ Aguardando player carregar...
                </p>
              )}
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
              className="flex-1 min-w-0 px-2 md:px-3 py-1.5 text-sm bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={handleCaptureCurrentTime}
              disabled={!playerReady}
              title="Capturar tempo atual do vídeo automaticamente"
              className="shrink-0 h-8 w-8 md:h-9 md:w-auto md:px-3"
            >
              <Save className="h-4 w-4" />
              <span className="hidden md:inline md:ml-1">Capturar</span>
            </Button>
            <Button
              size="sm"
              onClick={handleSaveProgress}
              disabled={!manualTime}
              className="shrink-0"
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
