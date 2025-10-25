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
import { Layers, Video as VideoIcon, ArrowRight, Download, Sparkles, X, TrendingUp, Clock, Heart, Zap } from "lucide-react";

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

// Função para gerar gradiente único baseado no título do tema
function getThemeGradient(title: string): string {
  const gradients = [
    'from-blue-500/20 via-purple-500/20 to-pink-500/20',
    'from-green-500/20 via-teal-500/20 to-blue-500/20',
    'from-orange-500/20 via-red-500/20 to-pink-500/20',
    'from-purple-500/20 via-indigo-500/20 to-blue-500/20',
    'from-yellow-500/20 via-orange-500/20 to-red-500/20',
    'from-pink-500/20 via-rose-500/20 to-red-500/20',
    'from-cyan-500/20 via-blue-500/20 to-indigo-500/20',
    'from-emerald-500/20 via-green-500/20 to-teal-500/20',
    'from-violet-500/20 via-purple-500/20 to-fuchsia-500/20',
    'from-amber-500/20 via-yellow-500/20 to-orange-500/20',
  ];

  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

// Função para gerar ilustração SVG baseada no tema
function getThemeIllustration(title: string): string {
  const titleLower = title.toLowerCase();

  const illustrations: { [key: string]: string } = {
    'tecnologia': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="40" width="120" height="80" rx="8" fill="currentColor" opacity="0.15"/><rect x="50" y="50" width="100" height="50" fill="currentColor" opacity="0.1"/><circle cx="60" cy="140" r="8" fill="currentColor" opacity="0.2"/><circle cx="100" cy="140" r="8" fill="currentColor" opacity="0.2"/><circle cx="140" cy="140" r="8" fill="currentColor" opacity="0.2"/></svg>`,
    'programação': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M60 80 L80 100 L60 120" stroke="currentColor" stroke-width="4" fill="none" opacity="0.2"/><path d="M140 80 L120 100 L140 120" stroke="currentColor" stroke-width="4" fill="none" opacity="0.2"/><line x1="90" y1="70" x2="110" y2="130" stroke="currentColor" stroke-width="4" opacity="0.15"/></svg>`,
    'software': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect x="50" y="50" width="100" height="100" rx="10" fill="currentColor" opacity="0.12"/><rect x="70" y="70" width="25" height="25" rx="4" fill="currentColor" opacity="0.18"/><rect x="105" y="70" width="25" height="25" rx="4" fill="currentColor" opacity="0.18"/><rect x="70" y="105" width="25" height="25" rx="4" fill="currentColor" opacity="0.18"/><rect x="105" y="105" width="25" height="25" rx="4" fill="currentColor" opacity="0.18"/></svg>`,
    'finanças': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="50" stroke="currentColor" stroke-width="6" fill="none" opacity="0.15"/><path d="M100 70 L100 130 M85 85 L100 70 L115 85" stroke="currentColor" stroke-width="5" fill="none" opacity="0.2"/></svg>`,
    'negócio': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="80" width="80" height="80" fill="currentColor" opacity="0.12"/><rect x="70" y="50" width="60" height="30" fill="currentColor" opacity="0.18"/><rect x="85" y="90" width="10" height="20" fill="currentColor" opacity="0.15"/><rect x="105" y="90" width="10" height="20" fill="currentColor" opacity="0.15"/></svg>`,
    'educação': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M100 60 L160 90 L100 120 L40 90 Z" fill="currentColor" opacity="0.15"/><rect x="90" y="120" width="20" height="40" fill="currentColor" opacity="0.12"/></svg>`,
    'saúde': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M100 60 L110 90 L140 90 L115 110 L125 140 L100 120 L75 140 L85 110 L60 90 L90 90 Z" fill="currentColor" opacity="0.15"/><circle cx="100" cy="100" r="60" stroke="currentColor" stroke-width="4" fill="none" opacity="0.1"/></svg>`,
    'design': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="80" cy="80" r="30" fill="currentColor" opacity="0.15"/><circle cx="120" cy="120" r="30" fill="currentColor" opacity="0.12"/><rect x="90" y="90" width="20" height="20" fill="currentColor" opacity="0.18"/></svg>`,
    'marketing': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M60 100 L90 70 L90 90 L140 90 L140 110 L90 110 L90 130 Z" fill="currentColor" opacity="0.15"/><circle cx="150" cy="100" r="8" fill="currentColor" opacity="0.2"/></svg>`,
    'default': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="40" fill="currentColor" opacity="0.1"/><circle cx="70" cy="70" r="20" fill="currentColor" opacity="0.15"/><circle cx="130" cy="130" r="25" fill="currentColor" opacity="0.12"/><circle cx="130" cy="70" r="15" fill="currentColor" opacity="0.18"/></svg>`,
  };

  for (const [keyword, svg] of Object.entries(illustrations)) {
    if (titleLower.includes(keyword)) {
      return `data:image/svg+xml;base64,${btoa(svg)}`;
    }
  }

  return `data:image/svg+xml;base64,${btoa(illustrations.default)}`;
}

const ThemeCard = ({ theme }: { theme: Theme }) => (
  <Link to={`/themes/${theme.id}`}>
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <Card className="flex flex-col h-full glass border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow group relative overflow-hidden">
        {/* Fundo com gradiente e ilustração */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${getThemeGradient(theme.title)} transition-opacity`}
          style={{
            backgroundImage: `url("${getThemeIllustration(theme.title)}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

        <CardHeader className="p-4 md:p-6 relative">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg bg-gradient-primary flex-shrink-0 shadow-sm">
              <Layers className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <CardTitle className="text-base md:text-lg leading-tight line-clamp-2 flex-1 group-hover:text-primary transition-colors">{theme.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4 pt-0 md:p-6 md:pt-0 relative">
          <CardDescription className="line-clamp-2 text-xs md:text-sm">{theme.description || "Nenhuma descrição para este tema."}</CardDescription>
        </CardContent>
        <CardContent className="p-4 pt-0 md:p-6 md:pt-0 relative">
          <Badge variant="secondary" className="text-xs font-medium">
            {theme.video_count || 0} vídeo{theme.video_count !== 1 ? 's' : ''}
          </Badge>
        </CardContent>
      </Card>
    </motion.div>
  </Link>
);

const getVideoThumbnail = (video: Video): string | null => {
  // Primeiro, tenta usar a thumbnail salva no banco (Instagram, TikTok, etc)
  if (video.thumbnail_url) {
    console.log("Using thumbnail_url from DB:", video.thumbnail_url.substring(0, 100));
    return video.thumbnail_url;
  }

  // Se não tiver, tenta extrair do YouTube
  try {
    const videoUrl = new URL(video.url);
    let videoId: string | null = null;
    if (videoUrl.hostname.includes("youtube.com")) {
      videoId = videoUrl.searchParams.get("v");
    } else if (videoUrl.hostname.includes("youtu.be")) {
      videoId = videoUrl.pathname.slice(1);
    }
    if (videoId) {
      console.log("Extracted YouTube thumbnail for video:", videoId);
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    console.log("No thumbnail found for video:", video.url);
    return null;
  } catch {
    console.log("Error parsing video URL:", video.url);
    return null;
  }
};

const VideoThumbnail = ({ thumbnail, title, className = "" }: { thumbnail: string | null, title: string | null, className?: string }) => {
  const [imageError, setImageError] = useState(false);

  if (!thumbnail || imageError) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <VideoIcon className="h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <img
        src={thumbnail}
        alt={title || "Thumbnail"}
        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${className}`}
        onError={() => {
          console.error("Failed to load thumbnail:", thumbnail);
          setImageError(true);
        }}
        crossOrigin="anonymous"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
    </>
  );
};

const RecentVideosTable = ({ videos, loading }: { videos: Video[], loading: boolean }) => {
  const navigate = useNavigate();
  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <VideoIcon className="h-5 w-5 text-primary" />
              Últimos Vídeos Adicionados
            </CardTitle>
            <CardDescription>Seu histórico de conteúdos processados recentemente.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 hover:text-primary">
            <Link to="/videos">Ver todos <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 p-4 rounded-lg border border-white/10">
                <Skeleton className="h-40 w-full rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video) => {
              const thumbnail = getVideoThumbnail(video);
              return (
                <motion.div
                  key={video.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => navigate(`/videos/${video.id}`)}
                  className="flex flex-col gap-3 p-4 rounded-lg border border-white/10 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all group"
                >
                  <div className="relative w-full aspect-video rounded-md overflow-hidden bg-muted">
                    <VideoThumbnail thumbnail={thumbnail} title={video.title} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors flex-1">
                        {video.title || "Sem título"}
                      </h3>
                      <span className={`px-2 py-1 text-[10px] rounded-full font-medium transition-colors whitespace-nowrap flex-shrink-0 ${video.status === 'Concluído'
                        ? 'bg-green-500/20 text-green-400'
                        : video.status === 'Processando'
                          ? 'bg-amber-500/20 text-amber-400 animate-pulse'
                          : 'bg-red-500/20 text-red-400'
                        }`}>
                        {video.status}
                      </span>
                    </div>
                    {video.channel && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {video.channel}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="truncate">
                        {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
                      </span>
                      {video.category && (
                        <>
                          <span>•</span>
                          <span className="truncate">{video.category}</span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum vídeo adicionado ainda.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredThemes, setFeaturedThemes] = useState<Theme[]>([]);
  const [recentVideos, setRecentVideos] = useState<Video[]>([]);
  const [favoriteVideos, setFavoriteVideos] = useState<Video[]>([]);
  const [topThemes, setTopThemes] = useState<Theme[]>([]);
  const [watchedVideos, setWatchedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalVideos: 0, totalThemes: 0, processedToday: 0, favorites: 0 });
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
          .limit(10);

        const favoritesPromise = supabase
          .from('videos')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_favorite', true)
          .order('created_at', { ascending: false })
          .limit(10);

        const watchedPromise = supabase
          .from('video_progress')
          .select(`
            video_id,
            last_watched_at,
            watched_time,
            videos (
              id,
              title,
              channel,
              url,
              thumbnail_url,
              video_url,
              created_at,
              status,
              category
            )
          `)
          .eq('user_id', user.id)
          .order('last_watched_at', { ascending: false })
          .limit(5);

        const topThemesPromise = supabase
          .from('themes')
          .select(`
            *,
            theme_videos(video_id)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // Fetch stats
        const statsPromise = Promise.all([
          supabase.from('videos').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('themes').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('videos').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
          supabase.from('videos').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_favorite', true),
        ]);

        const [
          { data: themesData },
          { data: videosData },
          { data: favoritesData },
          { data: topThemesData },
          { data: watchedData, error: watchedError },
          statsResults
        ] = await Promise.all([themesPromise, videosPromise, favoritesPromise, topThemesPromise, watchedPromise, statsPromise]);

        // Debug: verificar dados de vídeos assistidos
        console.log('📺 Query de vídeos assistidos:', {
          data: watchedData,
          error: watchedError,
          count: watchedData?.length || 0
        });

        // Process stats
        const newStats = {
          totalVideos: statsResults[0].count || 0,
          totalThemes: statsResults[1].count || 0,
          processedToday: statsResults[2].count || 0,
          favorites: statsResults[3].count || 0,
        };
        setStats(newStats);

        // Add video_count to themes and filter only themes with videos
        const themesWithCount = (themesData || [])
          .map((theme: any) => ({
            ...theme,
            video_count: theme.theme_videos?.length || 0,
          }))
          .filter((theme: any) => theme.video_count > 0);

        // Process top themes
        const processedTopThemes = (topThemesData || [])
          .map((theme: any) => ({
            ...theme,
            video_count: theme.theme_videos?.length || 0,
          }))
          .filter((theme: any) => theme.video_count > 0)
          .sort((a: any, b: any) => b.video_count - a.video_count)
          .slice(0, 5);

        // Process watched videos
        console.log('📺 Raw watchedData:', watchedData);

        const watchedVideosList = (watchedData || [])
          .map((wp: any) => {
            console.log('Processing watched item:', wp);
            return wp.videos;
          })
          .filter((video) => {
            if (!video) {
              console.warn('⚠️ Vídeo null encontrado no progresso');
              return false;
            }
            return true;
          });

        console.log('📺 Vídeos assistidos carregados:', {
          total: watchedVideosList.length,
          videos: watchedVideosList.map((v: any) => ({ id: v?.id, title: v?.title }))
        });

        setFeaturedThemes(themesWithCount);
        setRecentVideos(videosData || []);
        setFavoriteVideos(favoritesData || []);
        setTopThemes(processedTopThemes);
        setWatchedVideos(watchedVideosList);
        setLoading(false);
      };
      fetchData();

      // Subscription para mudanças em videos e themes
      const channel = supabase.channel('home-page-changes')
        .on<Video>(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'videos', filter: `user_id=eq.${user.id}` },
          () => {
            fetchData();
          }
        )
        .on<Theme>(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'themes', filter: `user_id=eq.${user.id}` },
          () => {
            fetchData();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'video_progress', filter: `user_id=eq.${user.id}` },
          () => {
            console.log('📺 Progresso de vídeo atualizado, recarregando dados...');
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
      <div className="w-full py-12">
        <div className="px-4 md:max-w-7xl md:mx-auto">
          <Skeleton className="h-12 w-80 mb-12" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-lg" />)}
          </div>
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="w-full py-20">
        <motion.div
          className="px-4 md:max-w-7xl md:mx-auto text-center"
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
      </div>
    )
  }

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-mesh-gradient opacity-50" />
      <div className="fixed inset-0 -z-10 bg-pattern-dots" />
      <div className="w-full py-6 md:py-12 relative">
        <motion.div
          className="px-4 md:max-w-7xl md:mx-auto"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <div className="mb-8 md:mb-12">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight">Olá, {userName}! 👋</h1>
          <p className="text-base md:text-lg text-muted-foreground mt-1">Bem-vindo de volta ao seu centro de conhecimento.</p>
        </div>

        {/* Extensions Banner */}
        {showExtensionBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.2 }}
            className="mb-8 md:mb-12 hidden md:block"
          >
            <Card className="glass border-primary/30 overflow-hidden relative group hover:border-primary/50 transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-primary opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-primary opacity-5" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleCloseBanner}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      <Badge variant="secondary" className="text-xs">Novo</Badge>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">
                      Extensões de Navegador Disponíveis!
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-4">
                      Compartilhe vídeos do YouTube, Instagram, TikTok e mais diretamente do seu navegador.
                      Disponível para Chrome, Edge e Firefox.
                    </p>
                    <Button asChild size="sm" className="md:h-9">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8 md:space-y-16">
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

            {/* Últimos Vídeos Assistidos */}
            {watchedVideos.length > 0 && (
              <section>
                <Card className="bg-card/50 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-primary" />
                          Últimos Vídeos Assistidos
                        </CardTitle>
                        <CardDescription>Continue de onde você parou</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {watchedVideos.map((video) => {
                        const thumbnail = getVideoThumbnail(video);
                        return (
                          <motion.div
                            key={video.id}
                            whileHover={{ scale: 1.01 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            onClick={() => navigate(`/videos/${video.id}`)}
                            className="flex flex-col md:flex-row gap-3 md:gap-4 p-3 md:p-4 rounded-lg border border-white/10 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all group"
                          >
                            <div className="flex gap-3 md:gap-4 flex-1 min-w-0">
                              <div className="relative h-16 w-24 md:h-20 md:w-36 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                                <VideoThumbnail thumbnail={thumbnail} title={video.title} />
                                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded z-10">
                                  <Clock className="h-3 w-3 inline mr-1" />
                                  Assistido
                                </div>
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                  <h3 className="font-semibold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">
                                    {video.title || "Sem título"}
                                  </h3>
                                  {video.channel && (
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                      {video.channel}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Favoritos */}
            {favoriteVideos.length > 0 && (
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Heart className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                    Vídeos Favoritos
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">Seus vídeos marcados como favoritos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 md:space-y-3 p-4 pt-0 md:p-6 md:pt-0">
                  {favoriteVideos.map((video) => {
                    const thumbnail = getVideoThumbnail(video);
                    return (
                      <Link
                        key={video.id}
                        to={`/videos/${video.id}`}
                        className="flex gap-2 md:gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors group"
                      >
                        <div className="relative w-16 h-12 md:w-20 md:h-14 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                          <VideoThumbnail thumbnail={thumbnail} title={video.title} className="w-full h-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs md:text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {video.title || "Sem título"}
                          </p>
                          <p className="text-[10px] md:text-xs text-muted-foreground mt-1 truncate">
                            {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Top Temas */}
            {topThemes.length > 0 && (
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    Principais Temas
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">Temas com mais vídeos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 md:space-y-3 p-4 pt-0 md:p-6 md:pt-0">
                  {topThemes.map((theme) => (
                    <Link
                      key={theme.id}
                      to={`/themes/${theme.id}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/5 transition-colors group"
                    >
                      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                        <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                          <Layers className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs md:text-sm group-hover:text-primary transition-colors line-clamp-1">
                            {theme.title}
                          </p>
                          <p className="text-[10px] md:text-xs text-muted-foreground">
                            {theme.video_count} vídeo{theme.video_count !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4 mt-8 md:mt-12">
          <Card className="glass border-border/50 hover:border-primary/30 transition-all hover-lift group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6 relative">
              <CardTitle className="text-xs md:text-sm font-medium">Total de Vídeos</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <VideoIcon className="h-3 w-3 md:h-4 md:w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0 relative">
              <div className="text-xl md:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">{stats.totalVideos}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">
                Vídeos na sua biblioteca
              </p>
            </CardContent>
          </Card>
          <Card className="glass border-border/50 hover:border-secondary/30 transition-all hover-lift group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6 relative">
              <CardTitle className="text-xs md:text-sm font-medium">Temas Criados</CardTitle>
              <div className="p-2 rounded-lg bg-secondary/10">
                <Layers className="h-3 w-3 md:h-4 md:w-4 text-secondary" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0 relative">
              <div className="text-xl md:text-2xl font-bold text-secondary">{stats.totalThemes}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">
                Organizados automaticamente
              </p>
            </CardContent>
          </Card>
          <Card className="glass border-border/50 hover:border-accent/30 transition-all hover-lift group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-5 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6 relative">
              <CardTitle className="text-xs md:text-sm font-medium">Processados Hoje</CardTitle>
              <div className="p-2 rounded-lg bg-accent/10">
                <Zap className="h-3 w-3 md:h-4 md:w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0 relative">
              <div className="text-xl md:text-2xl font-bold text-accent">{stats.processedToday}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">
                Vídeos adicionados hoje
              </p>
            </CardContent>
          </Card>
          <Card className="glass border-border/50 hover:border-red-500/30 transition-all hover-lift group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6 relative">
              <CardTitle className="text-xs md:text-sm font-medium">Favoritos</CardTitle>
              <div className="p-2 rounded-lg bg-red-500/10">
                <Heart className="h-3 w-3 md:h-4 md:w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 md:p-6 md:pt-0 relative">
              <div className="text-xl md:text-2xl font-bold text-red-500">{stats.favorites}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">
                Vídeos marcados como favoritos
              </p>
            </CardContent>
          </Card>
        </div>
        </motion.div>
      </div>
    </>
  );
}
