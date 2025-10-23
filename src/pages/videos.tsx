import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileDown,
  ListFilter,
  MoreHorizontal,
  Video as VideoIcon,
  Heart,
  Trash2,
} from "lucide-react"
import { formatDistanceToNow } from "@/lib/date-utils"
import { VideoProgressIndicator } from "@/components/video-progress-indicator"
import { useVideosProgress } from "@/hooks/use-videos-progress"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Video } from "@/types/database";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

// Função para extrair thumbnail da URL do vídeo ou usar o thumbnail salvo
function getVideoThumbnail(url: string, thumbnailUrl?: string | null): string {
  // Se tiver thumbnail_url do banco, usar proxy para evitar CORS
  if (thumbnailUrl) {
    // Usar proxy de imagem para evitar erro de CORS do Instagram
    return `https://images.weserv.nl/?url=${encodeURIComponent(thumbnailUrl)}&w=120&h=90&fit=cover`;
  }
  
  try {
    const urlObj = new URL(url);
    
    // YouTube
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      const videoId = urlObj.hostname.includes('youtu.be') 
        ? urlObj.pathname.slice(1)
        : urlObj.searchParams.get('v');
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      }
    }
    
    // Instagram (SVG placeholder - fallback se não tiver thumbnail_url)
    if (urlObj.hostname.includes('instagram.com')) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iOTAiIGZpbGw9IiNFNDQwNUYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkluc3RhZ3JhbTwvdGV4dD48L3N2Zz4=';
    }
    
    // TikTok (SVG placeholder)
    if (urlObj.hostname.includes('tiktok.com')) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iOTAiIGZpbGw9IiMwMDAwMDAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlRpa1RvazwvdGV4dD48L3N2Zz4=';
    }
    
    // Vimeo
    if (urlObj.hostname.includes('vimeo.com')) {
      return 'https://via.placeholder.com/120x90/1AB7EA/ffffff?text=Vimeo';
    }
    
    // Default
    return 'https://via.placeholder.com/120x90/666666/ffffff?text=Video';
  } catch {
    return 'https://via.placeholder.com/120x90/666666/ffffff?text=Video';
  }
}

export function VideosPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { progressMap } = useVideosProgress({
    videoIds: videos.map(v => v.id),
    userId: user?.id || null,
  });

  const fetchVideos = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    setVideos(data || []);
    setLoading(false);
  };

  const toggleFavorite = async (videoId: string, currentState: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const { error } = await supabase
      .from('videos')
      .update({ is_favorite: !currentState })
      .eq('id', videoId);

    if (error) {
      console.error('Error toggling favorite:', error);
      return;
    }

    // Atualizar localmente
    setVideos(videos.map(v => 
      v.id === videoId ? { ...v, is_favorite: !currentState } : v
    ));
  };

  const deleteVideo = async (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Tem certeza que deseja excluir este vídeo? Esta ação não pode ser desfeita.')) {
      return;
    }

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', videoId);

    if (error) {
      console.error('Error deleting video:', error);
      return;
    }

    // Remover localmente
    setVideos(videos.filter(v => v.id !== videoId));
  };

  useEffect(() => {
    fetchVideos();

    if (user) {
        const channel = supabase.channel('videos-page-changes')
        .on<Video>(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'videos', filter: `user_id=eq.${user.id}` },
          () => {
            fetchVideos();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-animated-gradient" />
      <div className="fixed inset-0 -z-10 bg-pattern-grid opacity-30" />
      <div className="w-full py-6 md:py-8 relative">
        <div className="px-4 md:max-w-7xl md:mx-auto">
          <PageHeader
            title="Vídeos Recentes"
            description="Gerencie todos os seus vídeos compartilhados."
          >
        <div className="flex items-center gap-2 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1">
                  <ListFilter className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filtrar
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Processando
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Processado</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Falha
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-9 gap-1">
              <FileDown className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Exportar
              </span>
            </Button>
          </div>
        </PageHeader>
        </div>
      
      <Tabs defaultValue="all" className="mt-6 md:mt-8">
        <div className="px-4 md:max-w-7xl md:mx-auto">
          <TabsList className="w-full md:w-auto grid grid-cols-3 md:inline-flex">
            <TabsTrigger value="all" className="text-xs md:text-sm">Todos</TabsTrigger>
            <TabsTrigger value="processing" className="text-xs md:text-sm">Processando</TabsTrigger>
            <TabsTrigger value="processed" className="text-xs md:text-sm">Processados</TabsTrigger>
            <TabsTrigger value="failed" className="hidden md:flex text-xs md:text-sm">
              Falha
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all" className="mt-4 md:mt-6 md:max-w-7xl md:mx-auto">
          {loading ? (
            <div className="space-y-0 md:space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <Card key={i} className="rounded-none md:rounded-lg border-x-0 md:border-x">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-20 h-14 rounded shrink-0" />
                      <div className="flex-1 min-w-0 space-y-2">
                        <Skeleton className="h-5 w-full max-w-md" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : videos.length > 0 ? (
            <>
              <div className="space-y-4 md:space-y-3">
                {videos.map((video) => (
                  <Card 
                    key={video.id} 
                    className="cursor-pointer glass border-border/50 hover:border-primary/50 transition-all hover-lift group rounded-lg overflow-hidden"
                    onClick={() => navigate(`/videos/${video.id}`)}
                  >
                    <CardContent className="!p-0 md:!p-4">
                      {/* Layout Mobile: Thumbnail em cima, info embaixo */}
                      <div className="md:hidden">
                        <img 
                          src={getVideoThumbnail(video.url, video.thumbnail_url)} 
                          alt={video.title || 'Thumbnail'}
                          className="w-full aspect-video object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/640x360/666666/ffffff?text=Video';
                          }}
                        />
                        <div className="p-3">
                          <div className="flex gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm line-clamp-2 mb-1">{video.title || new URL(video.url).hostname}</div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="capitalize">{new URL(video.url).hostname.split('.').slice(-2, -1)[0]}</span>
                                <span>•</span>
                                <span>{formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}</span>
                              </div>
                              <VideoProgressIndicator 
                                progress={progressMap.get(video.id) || null}
                              />
                            </div>
                            <div className="flex items-start gap-1 shrink-0">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={(e) => toggleFavorite(video.id, video.is_favorite, e)}
                              >
                                <Heart 
                                  className={`h-4 w-4 ${video.is_favorite ? 'fill-red-500 text-red-500' : ''}`}
                                />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Ações</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/videos/${video.id}`)}}>
                                    Ver Detalhes
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive" onClick={(e) => deleteVideo(video.id, e)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Layout Desktop: Horizontal */}
                      <div className="hidden md:flex items-center gap-3">
                        <img 
                          src={getVideoThumbnail(video.url, video.thumbnail_url)} 
                          alt={video.title || 'Thumbnail'}
                          className="w-20 h-14 object-cover rounded border border-border shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/120x90/666666/ffffff?text=Video';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-base truncate mb-1">{video.title || new URL(video.url).hostname}</div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <span className="capitalize">{new URL(video.url).hostname.split('.').slice(-2, -1)[0]}</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}</span>
                          </div>
                          <VideoProgressIndicator 
                            progress={progressMap.get(video.id) || null}
                          />
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge 
                            variant={video.status === 'Concluído' ? 'default' : video.status === 'Processando' ? 'secondary' : 'destructive'} 
                            className={`text-xs ${video.status === 'Processando' ? 'animate-pulse-glow' : ''}`}
                          >
                            {video.status}
                          </Badge>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9"
                            onClick={(e) => toggleFavorite(video.id, video.is_favorite, e)}
                          >
                            <Heart 
                              className={`h-4 w-4 ${video.is_favorite ? 'fill-red-500 text-red-500' : ''}`}
                            />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Ações</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/videos/${video.id}`)}}>
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive" onClick={(e) => deleteVideo(video.id, e)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="px-4 md:max-w-7xl md:mx-auto">
                <Card className="mt-4">
                  <CardFooter className="justify-between pt-6">
                  <div className="text-xs text-muted-foreground">
                    Mostrando <strong>1-{videos.length}</strong> de <strong>{videos.length}</strong> vídeos
                  </div>
                </CardFooter>
                </Card>
              </div>
            </>
          ) : (
            <div className="px-4 md:max-w-7xl md:mx-auto">
              <Card>
              <CardContent className="py-24">
                <EmptyState
                  icon={VideoIcon}
                  title="Nenhum vídeo encontrado"
                  description="Comece compartilhando um vídeo para que a mágica da IA aconteça."
                  action={{
                    label: "Compartilhar meu primeiro vídeo",
                    onClick: () => {
                      document.querySelector('#share-video-trigger')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    }
                  }}
                />
              </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </>
  )
}
