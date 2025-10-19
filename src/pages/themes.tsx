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
    <div className="container py-6 md:py-8 px-4">
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
                    <CardContent className="pb-4 p-4 pt-0 md:p-6 md:pt-0">
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
  )
}
