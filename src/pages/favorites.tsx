import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "@/lib/date-utils";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    
    if (urlObj.hostname.includes('tiktok.com')) {
      return 'https://via.placeholder.com/120x90/000000/ffffff?text=TikTok';
    }
    
    if (urlObj.hostname.includes('vimeo.com')) {
      return 'https://via.placeholder.com/120x90/1AB7EA/ffffff?text=Vimeo';
    }
    
    return 'https://via.placeholder.com/120x90/666666/ffffff?text=Video';
  } catch {
    return 'https://via.placeholder.com/120x90/666666/ffffff?text=Video';
  }
}

export function FavoritesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_favorite', true)
      .order('created_at', { ascending: false });
    
    setVideos(data || []);
    setLoading(false);
  };

  const toggleFavorite = async (videoId: string, currentState: boolean) => {
    const { error } = await supabase
      .from('videos')
      .update({ is_favorite: !currentState })
      .eq('id', videoId);

    if (error) {
      toast.error('Erro ao atualizar favorito');
      return;
    }

    toast.success(currentState ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
    fetchFavorites();
  };

  useEffect(() => {
    fetchFavorites();

    if (user) {
      const channel = supabase.channel('favorites-page-changes')
        .on<Video>(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'videos', filter: `user_id=eq.${user.id}` },
          () => {
            fetchFavorites();
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
      <div className="fixed inset-0 -z-10 bg-mesh-gradient opacity-60" />
      <div className="fixed inset-0 -z-10 bg-pattern-dots" />
      <div className="container py-6 md:py-8 px-2 md:px-4 relative">
        <PageHeader
          title="Favoritos"
          description="Seus vídeos favoritos em um só lugar."
        />
      
      <div className="mt-6 md:mt-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="!p-0">
                  <Skeleton className="w-full aspect-video rounded-t-lg" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {videos.map((video) => (
              <Card 
                key={video.id} 
                className="cursor-pointer glass border-border/50 hover:border-primary/50 transition-all hover-lift group rounded-lg overflow-hidden flex flex-col"
                onClick={() => navigate(`/videos/${video.id}`)}
              >
                <CardContent className="!p-0 flex flex-col flex-1">
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-video">
                    <img 
                      src={getVideoThumbnail(video.url, video.thumbnail_url)} 
                      alt={video.title || 'Thumbnail'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/640x360/666666/ffffff?text=Video';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <Badge 
                        variant={video.status === 'Concluído' ? 'default' : video.status === 'Processando' ? 'secondary' : 'destructive'} 
                        className={`text-xs ${video.status === 'Processando' ? 'animate-pulse-glow' : ''}`}
                      >
                        {video.status}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="p-3 flex flex-col flex-1">
                    <div className="flex gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm line-clamp-2 mb-1">{video.title || new URL(video.url).hostname}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="capitalize">{new URL(video.url).hostname.split('.').slice(-2, -1)[0]}</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1 mt-auto pt-2 border-t border-border/50">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(video.id, video.is_favorite);
                        }}
                      >
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
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
                          <DropdownMenuItem 
                            className="text-destructive" 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(video.id, video.is_favorite);
                            }}
                          >
                            Remover dos Favoritos
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-24">
              <EmptyState
                icon={Heart}
                title="Nenhum favorito ainda"
                description="Marque vídeos como favoritos para acessá-los rapidamente aqui."
              />
            </CardContent>
          </Card>
        )}
      </div>
      </div>
    </>
  );
}
