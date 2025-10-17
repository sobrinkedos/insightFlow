import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Film, Bot, Sparkles, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Theme, Video } from "@/types/database";
import { PageHeader } from "@/components/page-header";

export function ThemeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [consolidating, setConsolidating] = useState(false);

  useEffect(() => {
    const fetchThemeDetails = async () => {
      if (!user || !id) return;

      setLoading(true);

      const themePromise = supabase
        .from("themes")
        .select("*, video_count:videos(count)")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      const videosPromise = supabase
        .from("theme_videos")
        .select("video_id, videos(*)")
        .eq("theme_id", id);

      const [{ data: themeData }, { data: videosData }] = await Promise.all([
        themePromise,
        videosPromise,
      ]);

      setTheme(themeData as any);
      const videosList = (videosData || []).map((tv: any) => tv.videos).filter(Boolean);
      setVideos(videosList);
      setLoading(false);
    };

    fetchThemeDetails();
  }, [id, user]);

  const handleConsolidate = async () => {
    if (!id) return;
    
    setConsolidating(true);
    toast.info("Consolidando tema... Isso pode levar alguns segundos.");

    try {
      const { error } = await supabase.functions.invoke('consolidate-theme', {
        body: { theme_id: id },
      });

      if (error) {
        throw error;
      }

      toast.success("Tema consolidado com sucesso!");
      
      // Refresh theme data
      const { data: updatedTheme } = await supabase
        .from("themes")
        .select("*, video_count:videos(count)")
        .eq("id", id)
        .single();
      
      if (updatedTheme) {
        setTheme(updatedTheme as any);
      }
    } catch (error) {
      console.error("Error consolidating theme:", error);
      toast.error("Erro ao consolidar tema. Tente novamente.");
    } finally {
      setConsolidating(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-9 w-9" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-8 md:col-span-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="md:col-span-1">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!theme) {
    return (
      <main className="container flex flex-1 flex-col items-center justify-center gap-4 py-20">
        <h1 className="text-2xl font-bold">Tema não encontrado</h1>
        <p className="text-muted-foreground">
          O tema que você está procurando não existe ou você não tem permissão para vê-lo.
        </p>
        <Button onClick={() => navigate("/themes")}>
          <ArrowLeft className="mr-2" />
          Voltar para Meus Temas
        </Button>
      </main>
    );
  }

  return (
    <div className="container py-8">
      <PageHeader
        title={theme.title}
        description={theme.description || "Detalhes do tema consolidado."}
      >
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </PageHeader>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-4">
                <Bot className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>Resumo Consolidado por IA</CardTitle>
                  <CardDescription>Os principais insights de todos os vídeos deste tema.</CardDescription>
                </div>
              </div>
              {videos.length > 0 && (
                <Button 
                  onClick={handleConsolidate} 
                  disabled={consolidating}
                  size="sm"
                  variant="outline"
                >
                  {consolidating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Consolidando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      {theme?.consolidated_summary ? 'Reconsolidar' : 'Gerar Resumo'}
                    </>
                  )}
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {theme?.consolidated_summary ? (
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {theme.consolidated_summary}
                </p>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    O resumo deste tema ainda não foi gerado.
                  </p>
                  {videos.length > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Clique em "Gerar Resumo" para consolidar as informações de todos os vídeos deste tema.
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Adicione vídeos a este tema para gerar um resumo consolidado.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Palavras-chave</CardTitle>
              <CardDescription>Tópicos e termos mais frequentes nos vídeos.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {theme?.keywords && theme.keywords.length > 0 ? (
                theme.keywords.map((keyword, i) => (
                  <Badge key={i} variant="outline">{keyword}</Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhuma palavra-chave gerada ainda. Consolide o tema para gerar.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Vídeos Relacionados</CardTitle>
              <CardDescription>
                {videos.length} vídeo(s) neste tema.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {videos.length > 0 ? (
                videos.map((video, index) => (
                  <div key={video.id}>
                    <Link to={`/videos/${video.id}`} className="block hover:bg-muted/50 p-2 rounded-lg -m-2 transition-colors">
                        <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <Film className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium leading-tight line-clamp-2">
                            {video.title || "Sem título"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                            Adicionado{" "}
                            {formatDistanceToNow(new Date(video.created_at), { locale: ptBR, addSuffix: true })}
                            </p>
                        </div>
                        </div>
                    </Link>
                    {index < videos.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))
              ) : (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Nenhum vídeo associado a este tema ainda.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
