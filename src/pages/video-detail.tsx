import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Bot, FileText, Info, Film, Clock, Heart, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "@/lib/date-utils";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Video } from "@/types/database";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";

const getYoutubeEmbedUrl = (url: string): string | null => {
  try {
    const videoUrl = new URL(url);
    let videoId: string | null = null;
    if (videoUrl.hostname.includes("youtube.com")) {
      videoId = videoUrl.searchParams.get("v");
    } else if (videoUrl.hostname.includes("youtu.be")) {
      videoId = videoUrl.pathname.slice(1);
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch (e) {
    return null;
  }
};

export function VideoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [recentVideos, setRecentVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      if (!user || !id) return;
      setLoading(true);
      
      // Fetch current video
      const { data: videoData } = await supabase
        .from("videos")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();
      
      if (videoData) {
        setVideo(videoData);
        
        // Fetch related videos (same category)
        if (videoData.category) {
          const { data: related } = await supabase
            .from("videos")
            .select("*")
            .eq("user_id", user.id)
            .eq("category", videoData.category)
            .eq("status", "Concluído")
            .neq("id", id)
            .order("created_at", { ascending: false })
            .limit(5);
          
          setRelatedVideos(related || []);
        }
        
        // Fetch recent videos
        const { data: recent } = await supabase
          .from("videos")
          .select("*")
          .eq("user_id", user.id)
          .neq("id", id)
          .order("created_at", { ascending: false })
          .limit(5);
        
        setRecentVideos(recent || []);
      }
      
      setLoading(false);
    };

    fetchVideoDetails();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!video) return;
    
    const { error } = await supabase
      .from('videos')
      .update({ is_favorite: !video.is_favorite })
      .eq('id', video.id);

    if (error) {
      toast.error('Erro ao atualizar favorito');
      return;
    }

    setVideo({ ...video, is_favorite: !video.is_favorite });
    toast.success(video.is_favorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
  };

  const deleteVideo = async () => {
    if (!video) return;
    
    if (!confirm('Tem certeza que deseja excluir este vídeo? Esta ação não pode ser desfeita.')) {
      return;
    }

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', video.id);

    if (error) {
      toast.error('Erro ao excluir vídeo');
      return;
    }

    toast.success('Vídeo excluído com sucesso');
    navigate('/videos');
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="w-full aspect-video rounded-lg" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="lg:col-span-1">
             <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <main className="container flex flex-1 flex-col items-center justify-center gap-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Vídeo não encontrado</h1>
        <p className="text-muted-foreground">
          O vídeo que você está procurando não existe ou você não tem permissão para vê-lo.
        </p>
        <Button onClick={() => navigate("/videos")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Vídeos
        </Button>
      </main>
    );
  }

  const embedUrl = getYoutubeEmbedUrl(video.url);
  
  const getYouTubeThumbnail = (url: string): string | null => {
    try {
      const videoUrl = new URL(url);
      let videoId: string | null = null;
      if (videoUrl.hostname.includes("youtube.com")) {
        videoId = videoUrl.searchParams.get("v");
      } else if (videoUrl.hostname.includes("youtu.be")) {
        videoId = videoUrl.pathname.slice(1);
      }
      return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
    } catch {
      return null;
    }
  };

  const VideoCard = ({ video: v }: { video: Video }) => {
    const thumbnail = getYouTubeThumbnail(v.url);
    return (
      <Link 
        to={`/videos/${v.id}`} 
        className="flex gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors group"
      >
        {thumbnail ? (
          <div className="relative w-32 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
            <img 
              src={thumbnail} 
              alt={v.title || "Thumbnail"} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="flex w-32 h-20 flex-shrink-0 items-center justify-center rounded-md bg-muted">
            <Film className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {v.title || "Sem título"}
          </h4>
          {v.channel && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {v.channel}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(v.created_at), { addSuffix: true })}
          </p>
        </div>
      </Link>
    );
  };

  return (
    <div className="container py-8">
      <PageHeader
        title={video.title || "Detalhes do Vídeo"}
        description={video.channel ? `Canal: ${video.channel} • Adicionado em ${formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}` : `Adicionado em ${formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}`}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFavorite}
          >
            <Heart className={`h-4 w-4 ${video.is_favorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={deleteVideo}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </PageHeader>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {embedUrl && (
            <Card>
              <CardContent className="p-2">
                <div className="aspect-video">
                  <iframe
                    src={embedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-md"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary"><Bot className="mr-2 h-4 w-4" />Resumo IA</TabsTrigger>
              <TabsTrigger value="transcription"><FileText className="mr-2 h-4 w-4" />Transcrição</TabsTrigger>
              <TabsTrigger value="metadata"><Info className="mr-2 h-4 w-4" />Metadados</TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo Gerado por IA</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {video.summary_short || video.summary_expanded || video.tutorial_steps ? (
                    <>
                      {video.summary_short && (
                        <div>
                          <h4 className="font-semibold mb-2">Resumo Curto</h4>
                          <p className="text-muted-foreground">{video.summary_short}</p>
                        </div>
                      )}
                      {video.summary_expanded && (
                        <div>
                          <h4 className="font-semibold mb-2">Resumo Detalhado</h4>
                          <p className="text-muted-foreground whitespace-pre-wrap">{video.summary_expanded}</p>
                        </div>
                      )}
                      {video.is_tutorial && video.tutorial_steps && (
                        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg">📚</span>
                            <h4 className="font-semibold text-primary">Tutorial Detectado</h4>
                          </div>
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <div className="text-muted-foreground whitespace-pre-wrap">{video.tutorial_steps}</div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground">O resumo deste vídeo ainda não foi gerado.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="transcription">
              <Card>
                <CardHeader>
                  <CardTitle>Transcrição Completa</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground space-y-4 max-h-[500px] overflow-y-auto">
                   <p className="whitespace-pre-wrap">{video.transcription || "A transcrição deste vídeo ainda não foi gerada."}</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="metadata">
              <Card>
                <CardHeader>
                  <CardTitle>Metadados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">URL Original</span>
                        <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline truncate">{video.url}</a>
                    </div>
                    {video.channel && (
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">Canal</span>
                        <span className="text-sm text-muted-foreground">{video.channel}</span>
                      </div>
                    )}
                    {video.category && (
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">Categoria</span>
                        <span className="text-sm text-muted-foreground">{video.category}{video.subcategory ? ` • ${video.subcategory}` : ''}</span>
                      </div>
                    )}
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">Status</span>
                        <Badge variant={video.status === 'Concluído' ? 'default' : video.status === 'Processando' ? 'secondary' : 'destructive'} className="w-fit mt-1">
                            {video.status}
                        </Badge>
                    </div>
                    {video.topics && video.topics.length > 0 && (
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">Tópicos</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {video.topics.map((topic, i) => <Badge key={i} variant="secondary">{topic}</Badge>)}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">Palavras-chave</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {video.keywords && video.keywords.length > 0 ? (
                                video.keywords.map((kw, i) => <Badge key={i} variant="outline">{kw}</Badge>)
                            ) : (
                                <p className="text-sm text-muted-foreground">Nenhuma palavra-chave gerada.</p>
                            )}
                        </div>
                    </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {relatedVideos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Film className="h-5 w-5" />
                  Vídeos Relacionados
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Mesma categoria: {video.category}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {relatedVideos.map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5" />
                Últimos Vídeos
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Adicionados recentemente
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentVideos.length > 0 ? (
                recentVideos.map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum outro vídeo adicionado ainda.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
