import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "@/lib/date-utils";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Theme, Video } from "@/types/database";
import { EmptyState } from "@/components/empty-state";
import { Layers, Video as VideoIcon, ArrowRight, Download, Sparkles, X } from "lucide-react";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const ThemeCard = ({ theme }: { theme: Theme }) => (
  <Link to={`/themes/${theme.id}`}>
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="flex flex-col h-full bg-card/50 backdrop-blur-sm border-white/10 transition-shadow duration-300 hover:shadow-primary/20 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg leading-tight">{theme.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription className="line-clamp-2">{theme.description || "Nenhuma descrição para este tema."}</CardDescription>
        </CardContent>
        <CardContent>
          <p className="text-sm font-medium text-muted-foreground">{theme.video_count || 0} vídeos no tema</p>
        </CardContent>
      </Card>
    </motion.div>
  </Link>
);

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

const RecentVideosTable = ({ videos, loading }: { videos: Video[], loading: boolean }) => {
    const navigate = useNavigate();
    return (
        <Card className="bg-card/50 backdrop-blur-sm border-white/10">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Últimos Vídeos Adicionados</CardTitle>
                        <CardDescription>Seu histórico de conteúdos processados recentemente.</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link to="/videos">Ver todos <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-lg border border-white/10">
                                <Skeleton className="h-20 w-36 rounded-md flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-4 w-1/3" />
                                </div>
                            </div>
                        ))
                    ) : videos.length > 0 ? (
                        videos.map((video) => {
                            const thumbnail = getYouTubeThumbnail(video.url);
                            return (
                                <motion.div
                                    key={video.id}
                                    whileHover={{ scale: 1.01 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    onClick={() => navigate(`/videos/${video.id}`)}
                                    className="flex gap-4 p-4 rounded-lg border border-white/10 hover:border-primary/50 hover:bg-accent/50 cursor-pointer transition-all group"
                                >
                                    {thumbnail && (
                                        <div className="relative h-20 w-36 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                                            <img 
                                                src={thumbnail} 
                                                alt={video.title || "Thumbnail"} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                                                {video.title || "Sem título"}
                                            </h3>
                                            {video.channel && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {video.channel}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
                                            </span>
                                            {video.category && (
                                                <span className="text-xs text-muted-foreground">
                                                    • {video.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <span className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                                            video.status === 'Concluído' 
                                                ? 'bg-green-500/20 text-green-400' 
                                                : video.status === 'Processando' 
                                                ? 'bg-amber-500/20 text-amber-400 animate-pulse' 
                                                : 'bg-red-500/20 text-red-400'
                                        }`}>
                                            {video.status}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            Nenhum vídeo adicionado ainda.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredThemes, setFeaturedThemes] = useState<Theme[]>([]);
  const [recentVideos, setRecentVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExtensionBanner, setShowExtensionBanner] = useState(() => {
    return localStorage.getItem('hideExtensionBanner') !== 'true';
  });

  const handleCloseBanner = () => {
    setShowExtensionBanner(false);
    localStorage.setItem('hideExtensionBanner', 'true');
  };

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setLoading(true);
        
        const themesPromise = supabase
          .from('themes')
          .select(`
            *,
            theme_videos(video_id)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(4);

        const videosPromise = supabase
          .from('videos')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        const [{ data: themesData }, { data: videosData }] = await Promise.all([themesPromise, videosPromise]);

        // Add video_count to themes
        const themesWithCount = (themesData || []).map((theme: any) => ({
          ...theme,
          video_count: theme.theme_videos?.length || 0,
        }));

        setFeaturedThemes(themesWithCount);
        setRecentVideos(videosData || []);
        setLoading(false);
      };
      fetchData();

      const channel = supabase.channel('home-page-changes')
        .on<Video | Theme>(
          'postgres_changes',
          { event: '*', schema: 'public', filter: `user_id=eq.${user.id}` },
          () => {
            fetchData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };

    } else {
        setLoading(false);
    }
  }, [user]);

  const userName = user?.email?.split('@')[0] || 'Visitante';

  if (loading && user) {
      return (
        <div className="container py-12">
            <Skeleton className="h-12 w-80 mb-12" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-lg" />)}
            </div>
            <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      )
  }

  if (!user) {
    return (
        <motion.div 
            className="container text-center py-20"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            <div className="absolute top-0 left-0 w-full h-full bg-background -z-10 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
            <h1 className="text-4xl font-bold tracking-tight lg:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                Transforme Vídeos em Conhecimento
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                O InsightShare organiza, transcreve e resume seus vídeos compartilhados, criando uma base de conhecimento pesquisável e inteligente.
            </p>
            <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" onClick={() => navigate('/signup')}>Comece Gratuitamente <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
        </motion.div>
    )
  }

  return (
    <motion.div 
        className="container py-12"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
    >
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Olá, {userName}! 👋</h1>
        <p className="text-lg text-muted-foreground">Bem-vindo de volta ao seu centro de conhecimento.</p>
      </div>

      {/* Extensions Banner */}
      {showExtensionBanner && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleCloseBanner}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <Badge variant="secondary" className="text-xs">Novo</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Extensões de Navegador Disponíveis!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Compartilhe vídeos do YouTube, Instagram, TikTok e mais diretamente do seu navegador. 
                    Disponível para Chrome, Edge e Firefox.
                  </p>
                  <Button asChild>
                    <Link to="/extensions">
                      <Download className="mr-2 h-4 w-4" />
                      Baixar Extensões
                    </Link>
                  </Button>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <div className="p-3 rounded-lg bg-background/50 backdrop-blur">
                    <Download className="h-8 w-8 text-primary" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Temas em Destaque</h2>
            <Button variant="ghost" asChild>
                <Link to="/themes">Ver todos <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
        </div>
        
        {featuredThemes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {featuredThemes.map((theme) => (
                    <ThemeCard theme={theme} key={theme.id} />
                ))}
            </div>
        ) : (
            <EmptyState
                icon={Layers}
                title="Nenhum tema criado"
                description="Os temas são criados automaticamente quando vídeos com assuntos semelhantes são adicionados."
                className="h-64"
            />
        )}
      </section>

      <section>
        {recentVideos.length > 0 ? (
            <RecentVideosTable videos={recentVideos} loading={loading} />
        ) : (
            <EmptyState
                icon={VideoIcon}
                title="Nenhum vídeo adicionado"
                description="Comece compartilhando um vídeo para que a mágica da IA aconteça."
                action={{
                    label: "Compartilhar meu primeiro vídeo",
                    onClick: () => {
                        document.querySelector('#share-video-trigger')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    }
                }}
            />
        )}
      </section>
    </motion.div>
  );
}
