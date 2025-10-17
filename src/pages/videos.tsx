import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileDown,
  ListFilter,
  MoreHorizontal,
  Video as VideoIcon,
} from "lucide-react"
import { formatDistanceToNow } from "@/lib/date-utils"

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

// Função para extrair thumbnail da URL do vídeo
function getVideoThumbnail(url: string): string {
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
    
    // Instagram (placeholder)
    if (urlObj.hostname.includes('instagram.com')) {
      return 'https://via.placeholder.com/120x90/E4405F/ffffff?text=Instagram';
    }
    
    // TikTok (placeholder)
    if (urlObj.hostname.includes('tiktok.com')) {
      return 'https://via.placeholder.com/120x90/000000/ffffff?text=TikTok';
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
    <div className="container py-8">
      <PageHeader
        title="Vídeos Recentes"
        description="Gerencie todos os seus vídeos compartilhados."
      >
        <div className="flex items-center gap-2">
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
      
      <Tabs defaultValue="all" className="mt-8">
        <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="processing">Processando</TabsTrigger>
            <TabsTrigger value="processed">Processados</TabsTrigger>
            <TabsTrigger value="failed" className="hidden sm:flex">
              Falha
            </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-full">Vídeo</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Status</TableHead>
                      <TableHead className="w-[50px]">
                        <span className="sr-only">Ações</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {loading ? (
                     Array.from({ length: 10 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Skeleton className="w-20 h-14 rounded shrink-0" />
                                <div className="flex-1 min-w-0 space-y-2">
                                  <Skeleton className="h-5 w-full max-w-xs" />
                                  <Skeleton className="h-3 w-20" />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Skeleton className="h-6 w-20 rounded-full ml-auto" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-8 w-8 ml-auto" />
                            </TableCell>
                        </TableRow>
                    ))
                  ) : videos.length > 0 ? (
                    videos.map((video) => (
                      <TableRow key={video.id} onClick={() => navigate(`/videos/${video.id}`)} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="py-3">
                            <div className="flex items-center gap-3">
                              <img 
                                src={getVideoThumbnail(video.url)} 
                                alt={video.title || 'Thumbnail'}
                                className="w-20 h-14 object-cover rounded border border-border shrink-0"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/120x90/666666/ffffff?text=Video';
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate mb-1">{video.title || new URL(video.url).hostname}</div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span className="capitalize">{new URL(video.url).hostname.split('.').slice(-2, -1)[0]}</span>
                                  <span>•</span>
                                  <span className="hidden sm:inline">{formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}</span>
                                </div>
                              </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                            <Badge variant={video.status === 'Processado' ? 'default' : video.status === 'Processando' ? 'secondary' : 'destructive'} className={video.status === 'Processando' ? 'animate-pulse' : ''}>
                                {video.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex justify-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button
                                        aria-haspopup="true"
                                        size="icon"
                                        variant="ghost"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/videos/${video.id}`)}}>Ver Detalhes</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                                        Excluir
                                    </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                        <TableCell colSpan={3}>
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
                                className="py-24"
                            />
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                </Table>
              </div>
            </CardContent>
            {videos.length > 0 && (
                <CardFooter className="justify-between border-t pt-6">
                    <div className="text-xs text-muted-foreground">
                        Mostrando <strong>1-{videos.length}</strong> de <strong>{videos.length}</strong> vídeos
                    </div>
                </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
