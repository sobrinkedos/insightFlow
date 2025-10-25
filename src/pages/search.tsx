import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search as SearchIcon, Video } from "lucide-react";
import { VideoProgressIndicator } from "@/components/video-progress-indicator";

interface SearchResult {
  id: string;
  url: string;
  title: string;
  summary_short: string;
  summary_expanded: string;
  keywords: string[];
  topics: string[];
  tags: string[];
  thumbnail_url: string | null;
  created_at: string;
}

// Função para extrair o ID do vídeo do YouTube
const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

// Função para gerar URL da thumbnail do YouTube
const getYouTubeThumbnail = (url: string): string => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : "";
};

// Função para obter thumbnail do vídeo (YouTube ou Instagram)
const getVideoThumbnail = (video: SearchResult): string | null => {
  // Se tiver thumbnail_url salva (Instagram, TikTok, etc), usar ela
  if (video.thumbnail_url) {
    return video.thumbnail_url;
  }
  
  // Caso contrário, tentar extrair do YouTube
  if (video.url.includes('youtube.com') || video.url.includes('youtu.be')) {
    return getYouTubeThumbnail(video.url);
  }
  
  return null;
};

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { user } = useAuth();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !query) {
      setLoading(false);
      return;
    }

    const searchVideos = async () => {
      setLoading(true);
      
      try {
        // Busca todos os vídeos do usuário
        const { data, error } = await supabase
          .from("videos")
          .select("id, url, title, summary_short, summary_expanded, keywords, topics, tags, thumbnail_url, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        console.log("Vídeos encontrados:", data?.length);
        console.log("Query de busca:", query);

        if (error) {
          console.error("Erro ao buscar vídeos:", error);
          setResults([]);
        } else {
          // Filtra localmente por título, resumo, keywords ou topics
          const searchLower = query.toLowerCase();
          const filtered = (data || []).filter((video) => {
            const titleMatch = video.title?.toLowerCase().includes(searchLower);
            const summaryShortMatch = video.summary_short?.toLowerCase().includes(searchLower);
            const summaryExpandedMatch = video.summary_expanded?.toLowerCase().includes(searchLower);
            const keywordsMatch = video.keywords?.some((keyword: string) =>
              keyword.toLowerCase().includes(searchLower)
            );
            const topicsMatch = video.topics?.some((topic: string) =>
              topic.toLowerCase().includes(searchLower)
            );
            
            return titleMatch || summaryShortMatch || summaryExpandedMatch || keywordsMatch || topicsMatch;
          });
          
          console.log("Resultados filtrados:", filtered.length);
          setResults(filtered);
        }
      } catch (err) {
        console.error("Erro na busca:", err);
        setResults([]);
      }
      
      setLoading(false);
    };

    searchVideos();
  }, [query, user]);

  if (!user) {
    return (
      <div className="container py-8 px-4">
        <p className="text-muted-foreground">Faça login para pesquisar vídeos.</p>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-animated-gradient" />
      <div className="fixed inset-0 -z-10 bg-pattern-grid opacity-30" />
      <div className="container py-8 px-4 relative">
        <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Resultados da Busca</h1>
        <p className="text-muted-foreground">
          {loading ? (
            "Buscando..."
          ) : (
            <>
              {results.length} resultado{results.length !== 1 ? "s" : ""} para "{query}"
            </>
          )}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : results.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <SearchIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Nenhum resultado encontrado</p>
            <p className="text-sm text-muted-foreground">
              Tente usar palavras-chave diferentes ou verifique a ortografia.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((video) => {
            const thumbnail = getVideoThumbnail(video);
            return (
              <Link key={video.id} to={`/video/${video.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    {thumbnail ? (
                      <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                        <img
                          src={thumbnail}
                          alt={video.title || "Video"}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            // Se a imagem falhar ao carregar, mostrar placeholder
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="w-full h-full bg-muted flex items-center justify-center"><svg class="h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></div>';
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="relative aspect-video w-full bg-muted flex items-center justify-center rounded-t-lg">
                        <Video className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-2">{video.title}</CardTitle>
                  <CardDescription className="line-clamp-3 mb-3">
                    {video.summary_short || video.summary_expanded}
                  </CardDescription>
                  <div className="space-y-2">
                    {video.topics && video.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {video.topics.slice(0, 2).map((topic, index) => {
                          const isMatch = topic.toLowerCase().includes(query.toLowerCase());
                          return (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className={`text-xs ${isMatch ? 'bg-primary text-primary-foreground' : ''}`}
                            >
                              {topic}
                            </Badge>
                          );
                        })}
                        {video.topics.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{video.topics.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                    {video.keywords && video.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {video.keywords.slice(0, 3).map((keyword, index) => {
                          const isMatch = keyword.toLowerCase().includes(query.toLowerCase());
                          return (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className={`text-xs ${isMatch ? 'border-primary text-primary' : ''}`}
                            >
                              {keyword}
                            </Badge>
                          );
                        })}
                        {video.keywords.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{video.keywords.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
          })}
        </div>
      )}
      </div>
    </>
  );
}
