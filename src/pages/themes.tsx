import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layers,
  MoreHorizontal,
} from "lucide-react"
import { formatDistanceToNow } from "@/lib/date-utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { Theme } from "@/types/database";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

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
  
  // Gerar hash simples do título para escolher gradiente consistente
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

// Função para gerar padrão SVG de fundo
function getThemePattern(title: string): string {
  const patterns = [
    // Círculos
    `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="20" fill="currentColor" opacity="0.1"/></svg>`,
    // Quadrados
    `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="40" height="40" fill="currentColor" opacity="0.1"/></svg>`,
    // Linhas diagonais
    `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="60" y2="60" stroke="currentColor" stroke-width="2" opacity="0.1"/></svg>`,
    // Pontos
    `<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.15"/></svg>`,
    // Grade
    `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M0 20h40M20 0v40" stroke="currentColor" stroke-width="1" opacity="0.1"/></svg>`,
  ];
  
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % patterns.length;
  const pattern = patterns[index];
  return `data:image/svg+xml;base64,${btoa(pattern)}`;
}

export function ThemesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchThemes = async () => {
    if (!user) return;
    setLoading(true);
    
    // Buscar apenas temas que têm vídeos associados
    const { data: themesWithVideos } = await supabase
      .from('theme_videos')
      .select('theme_id')
      .not('theme_id', 'is', null);
    
    const themeIds = [...new Set(themesWithVideos?.map(tv => tv.theme_id) || [])];
    
    if (themeIds.length === 0) {
      setThemes([]);
      setLoading(false);
      return;
    }
    
    const { data } = await supabase
      .from('themes')
      .select('*, theme_videos(video_id)')
      .eq('user_id', user.id)
      .in('id', themeIds)
      .order('created_at', { ascending: false });
    
    // Processar os dados para extrair o count
    const processedData = (data || []).map(theme => ({
      ...theme,
      video_count: theme.theme_videos?.length || 0
    }));
    
    setThemes(processedData as any);
    setLoading(false);
  };

  useEffect(() => {
    fetchThemes();
    if (user) {
      const channel = supabase.channel('themes-page-changes')
        .on<Theme>(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'themes', filter: `user_id=eq.${user.id}` },
          () => {
            fetchThemes();
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
      <div className="container py-6 md:py-8 px-4 relative">
        <PageHeader
          title="Meus Temas"
          description="Seus vídeos organizados automaticamente por temas pela IA."
        />
      
      <div className="mt-6 md:mt-8">
        <div>
          {loading ? (
            <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-3 p-4 md:p-6">
                    <Skeleton className="h-5 md:h-6 w-3/4 mb-2" />
                    <Skeleton className="h-3 md:h-4 w-full" />
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    <Skeleton className="h-3 md:h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : themes.length > 0 ? (
            <>
              <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
                {themes.map((theme) => (
                  <Card 
                    key={theme.id} 
                    className="group cursor-pointer overflow-hidden glass border-border/50 hover:border-primary/50 transition-all hover:shadow-glow hover-lift relative"
                    onClick={() => navigate(`/themes/${theme.id}`)}
                  >
                    {/* Fundo com gradiente e padrão */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-br ${getThemeGradient(theme.title)} transition-opacity`}
                      style={{
                        backgroundImage: `url("${getThemePattern(theme.title)}")`,
                        backgroundSize: '60px 60px',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity" />
                    
                    <CardHeader className="pb-3 p-4 md:p-6 relative">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                          <div className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-primary shadow-sm">
                            <Layers className="h-4 w-4 md:h-5 md:w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">
                              {theme.title}
                            </CardTitle>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 opacity-0 md:group-hover:opacity-100 transition-opacity flex-shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Ações</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/themes/${theme.id}`)}}>
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive" 
                              onClick={(e) => e.stopPropagation()}
                            >
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {theme.description && (
                        <CardDescription className="line-clamp-2 mt-2 text-xs md:text-sm">
                          {theme.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pb-4 p-4 pt-0 md:p-6 md:pt-0 relative">
                      <div className="flex items-center justify-between text-xs md:text-sm flex-wrap gap-2">
                        <div className="flex items-center gap-2 md:gap-4">
                          <Badge variant="secondary" className="font-normal text-[10px] md:text-xs">
                            {theme.video_count} {theme.video_count === 1 ? 'vídeo' : 'vídeos'}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(theme.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                <p>
                  Mostrando <strong>{themes.length}</strong> {themes.length === 1 ? 'tema' : 'temas'}
                </p>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="py-24">
                <EmptyState
                  icon={Layers}
                  title="Nenhum tema encontrado"
                  description="Adicione vídeos e a IA irá agrupá-los em temas automaticamente."
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </>
  )
}
