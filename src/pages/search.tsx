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
  title: string;
  summary: string;
  keywords: string[];
  thumbnail_url: string | null;
  created_at: string;
}

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
          .select("id, title, summary, keywords, thumbnail_url, created_at")
          .eq("user_id", user.id)
          .eq("status", "Concluído")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Erro ao buscar vídeos:", error);
          setResults([]);
        } else {
          // Filtra localmente por título, resumo ou keywords
          const searchLower = query.toLowerCase();
          const filtered = (data || []).filter((video) => {
            const titleMatch = video.title?.toLowerCase().includes(searchLower);
            const summaryMatch = video.summary?.toLowerCase().includes(searchLower);
            const keywordsMatch = video.keywords?.some((keyword: string) =>
              keyword.toLowerCase().includes(searchLower)
            );
            return titleMatch || summaryMatch || keywordsMatch;
          });
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
      <div className="container py-8">
        <p className="text-muted-foreground">Faça login para pesquisar vídeos.</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
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
          {results.map((video) => (
            <Link key={video.id} to={`/video/${video.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  {video.thumbnail_url ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="object-cover w-full h-full"
                      />
                      <VideoProgressIndicator videoId={video.id} />
                    </div>
                  ) : (
                    <div className="relative aspect-video w-full bg-muted flex items-center justify-center rounded-t-lg">
                      <Video className="h-12 w-12 text-muted-foreground" />
                      <VideoProgressIndicator videoId={video.id} />
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-2">{video.title}</CardTitle>
                  <CardDescription className="line-clamp-3 mb-3">
                    {video.summary}
                  </CardDescription>
                  {video.keywords && video.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {video.keywords.slice(0, 3).map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                      {video.keywords.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{video.keywords.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
