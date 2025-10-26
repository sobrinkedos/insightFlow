import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layers,
  MoreHorizontal,
  Search,
  X,
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

// Função para gerar ilustração SVG baseada no tema
function getThemeIllustration(title: string): string {
  const titleLower = title.toLowerCase();
  
  // Mapeamento de palavras-chave para ilustrações
  const illustrations: { [key: string]: string } = {
    // Tecnologia e Programação
    'tecnologia': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="40" width="120" height="80" rx="8" fill="currentColor" opacity="0.15"/><rect x="50" y="50" width="100" height="50" fill="currentColor" opacity="0.1"/><circle cx="60" cy="140" r="8" fill="currentColor" opacity="0.2"/><circle cx="100" cy="140" r="8" fill="currentColor" opacity="0.2"/><circle cx="140" cy="140" r="8" fill="currentColor" opacity="0.2"/></svg>`,
    'programação': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M60 80 L80 100 L60 120" stroke="currentColor" stroke-width="4" fill="none" opacity="0.2"/><path d="M140 80 L120 100 L140 120" stroke="currentColor" stroke-width="4" fill="none" opacity="0.2"/><line x1="90" y1="70" x2="110" y2="130" stroke="currentColor" stroke-width="4" opacity="0.15"/></svg>`,
    'software': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect x="50" y="50" width="100" height="100" rx="10" fill="currentColor" opacity="0.12"/><rect x="70" y="70" width="25" height="25" rx="4" fill="currentColor" opacity="0.18"/><rect x="105" y="70" width="25" height="25" rx="4" fill="currentColor" opacity="0.18"/><rect x="70" y="105" width="25" height="25" rx="4" fill="currentColor" opacity="0.18"/><rect x="105" y="105" width="25" height="25" rx="4" fill="currentColor" opacity="0.18"/></svg>`,
    'código': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="60" width="120" height="8" rx="4" fill="currentColor" opacity="0.15"/><rect x="40" y="80" width="90" height="8" rx="4" fill="currentColor" opacity="0.12"/><rect x="40" y="100" width="110" height="8" rx="4" fill="currentColor" opacity="0.18"/><rect x="40" y="120" width="80" height="8" rx="4" fill="currentColor" opacity="0.1"/></svg>`,
    
    // Negócios e Finanças
    'finanças': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="50" stroke="currentColor" stroke-width="6" fill="none" opacity="0.15"/><path d="M100 70 L100 130 M85 85 L100 70 L115 85" stroke="currentColor" stroke-width="5" fill="none" opacity="0.2"/></svg>`,
    'negócio': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="80" width="80" height="80" fill="currentColor" opacity="0.12"/><rect x="70" y="50" width="60" height="30" fill="currentColor" opacity="0.18"/><rect x="85" y="90" width="10" height="20" fill="currentColor" opacity="0.15"/><rect x="105" y="90" width="10" height="20" fill="currentColor" opacity="0.15"/></svg>`,
    'economia': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M40 140 L70 110 L100 130 L130 80 L160 100" stroke="currentColor" stroke-width="5" fill="none" opacity="0.2"/><circle cx="70" cy="110" r="6" fill="currentColor" opacity="0.25"/><circle cx="100" cy="130" r="6" fill="currentColor" opacity="0.25"/><circle cx="130" cy="80" r="6" fill="currentColor" opacity="0.25"/></svg>`,
    'investimento': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="120" width="20" height="40" fill="currentColor" opacity="0.15"/><rect x="90" y="100" width="20" height="60" fill="currentColor" opacity="0.18"/><rect x="120" y="70" width="20" height="90" fill="currentColor" opacity="0.2"/></svg>`,
    
    // Educação e Aprendizado
    'educação': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M100 60 L160 90 L100 120 L40 90 Z" fill="currentColor" opacity="0.15"/><rect x="90" y="120" width="20" height="40" fill="currentColor" opacity="0.12"/></svg>`,
    'aprendizado': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect x="60" y="60" width="80" height="100" rx="5" fill="currentColor" opacity="0.12"/><rect x="70" y="80" width="60" height="4" fill="currentColor" opacity="0.18"/><rect x="70" y="95" width="60" height="4" fill="currentColor" opacity="0.18"/><rect x="70" y="110" width="60" height="4" fill="currentColor" opacity="0.18"/></svg>`,
    'curso': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="80" r="25" fill="currentColor" opacity="0.15"/><path d="M70 120 Q100 110 130 120 L130 150 Q100 160 70 150 Z" fill="currentColor" opacity="0.12"/></svg>`,
    
    // Saúde e Bem-estar
    'saúde': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M100 60 L110 90 L140 90 L115 110 L125 140 L100 120 L75 140 L85 110 L60 90 L90 90 Z" fill="currentColor" opacity="0.15"/><circle cx="100" cy="100" r="60" stroke="currentColor" stroke-width="4" fill="none" opacity="0.1"/></svg>`,
    'fitness': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="70" cy="100" r="15" fill="currentColor" opacity="0.18"/><circle cx="130" cy="100" r="15" fill="currentColor" opacity="0.18"/><rect x="85" y="95" width="30" height="10" fill="currentColor" opacity="0.15"/></svg>`,
    'bem-estar': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M100 140 Q70 110 70 85 Q70 60 90 60 Q100 60 100 70 Q100 60 110 60 Q130 60 130 85 Q130 110 100 140 Z" fill="currentColor" opacity="0.15"/></svg>`,
    
    // Design e Arte
    'design': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="80" cy="80" r="30" fill="currentColor" opacity="0.15"/><circle cx="120" cy="120" r="30" fill="currentColor" opacity="0.12"/><rect x="90" y="90" width="20" height="20" fill="currentColor" opacity="0.18"/></svg>`,
    'arte': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M100 50 L120 90 L160 90 L130 115 L145 155 L100 130 L55 155 L70 115 L40 90 L80 90 Z" fill="currentColor" opacity="0.15"/></svg>`,
    'criativo': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="70" r="20" fill="currentColor" opacity="0.15"/><path d="M80 100 L100 90 L120 100 L110 120 L90 120 Z" fill="currentColor" opacity="0.18"/><circle cx="100" cy="140" r="15" fill="currentColor" opacity="0.12"/></svg>`,
    
    // Ciência e Pesquisa
    'ciência': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M80 60 L80 100 L60 140 L140 140 L120 100 L120 60 Z" fill="currentColor" opacity="0.15"/><circle cx="100" cy="80" r="8" fill="currentColor" opacity="0.2"/></svg>`,
    'pesquisa': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="90" cy="90" r="35" stroke="currentColor" stroke-width="6" fill="none" opacity="0.15"/><line x1="115" y1="115" x2="145" y2="145" stroke="currentColor" stroke-width="8" opacity="0.2"/></svg>`,
    
    // Comunicação e Marketing
    'marketing': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M60 100 L90 70 L90 90 L140 90 L140 110 L90 110 L90 130 Z" fill="currentColor" opacity="0.15"/><circle cx="150" cy="100" r="8" fill="currentColor" opacity="0.2"/></svg>`,
    'comunicação': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect x="50" y="80" width="100" height="60" rx="8" fill="currentColor" opacity="0.12"/><path d="M90 140 L100 155 L110 140" fill="currentColor" opacity="0.15"/></svg>`,
    'mídia': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect x="50" y="60" width="100" height="80" rx="5" fill="currentColor" opacity="0.12"/><polygon points="85,90 85,110 105,100" fill="currentColor" opacity="0.2"/></svg>`,
    
    // Padrão genérico
    'default': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="40" fill="currentColor" opacity="0.1"/><circle cx="70" cy="70" r="20" fill="currentColor" opacity="0.15"/><circle cx="130" cy="130" r="25" fill="currentColor" opacity="0.12"/><circle cx="130" cy="70" r="15" fill="currentColor" opacity="0.18"/></svg>`,
  };
  
  // Procurar por palavras-chave no título
  for (const [keyword, svg] of Object.entries(illustrations)) {
    if (titleLower.includes(keyword)) {
      return `data:image/svg+xml;base64,${btoa(svg)}`;
    }
  }
  
  // Se não encontrar palavra-chave, usar padrão baseado em hash
  return `data:image/svg+xml;base64,${btoa(illustrations.default)}`;
}

export function ThemesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [filteredThemes, setFilteredThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
    setFilteredThemes(processedData as any);
    setLoading(false);
  };

  // Filtrar temas baseado na busca
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredThemes(themes);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = themes.filter(theme => 
      theme.title.toLowerCase().includes(query) ||
      theme.description?.toLowerCase().includes(query)
    );
    setFilteredThemes(filtered);
  }, [searchQuery, themes]);

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
      <div className="container py-6 md:py-8 px-2 md:px-4 relative">
        <PageHeader
          title="Meus Temas"
          description="Seus vídeos organizados automaticamente por temas pela IA."
        />

        {/* Barra de busca */}
        <div className="mt-6 md:mt-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar temas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      
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
              {filteredThemes.length === 0 ? (
                <Card>
                  <CardContent className="py-24">
                    <EmptyState
                      icon={Search}
                      title="Nenhum tema encontrado"
                      description={`Nenhum tema corresponde à busca "${searchQuery}".`}
                    />
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredThemes.map((theme) => (
                  <Card 
                    key={theme.id} 
                    className="group cursor-pointer overflow-hidden glass border-border/50 hover:border-primary/50 transition-all hover:shadow-glow hover-lift relative"
                    onClick={() => navigate(`/themes/${theme.id}`)}
                  >
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
                      Mostrando <strong>{filteredThemes.length}</strong> de <strong>{themes.length}</strong> {themes.length === 1 ? 'tema' : 'temas'}
                      {searchQuery && ` para "${searchQuery}"`}
                    </p>
                  </div>
                </>
              )}
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
