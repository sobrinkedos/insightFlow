import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileDown,
  Layers,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

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
    const { data } = await supabase
      .from('themes')
      .select('*, video_count:videos!inner(count)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    setThemes((data as any) || []);
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
    <div className="container py-8">
      <PageHeader
        title="Meus Temas"
        description="Gerencie seus temas e veja o progresso da consolidação."
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
                <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Ativo
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Rascunho</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Arquivado
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-9 gap-1">
              <FileDown className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Exportar
              </span>
            </Button>
            <Button size="sm" className="h-9 gap-1">
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Adicionar Tema
              </span>
            </Button>
          </div>
      </PageHeader>
      
      <Tabs defaultValue="all" className="mt-8">
        <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="draft">Rascunhos</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
                Arquivados
            </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tema</TableHead>
                    <TableHead className="w-[140px]">Vídeos</TableHead>
                    <TableHead className="hidden md:table-cell w-[200px]">
                      Última Atualização
                    </TableHead>
                    <TableHead className="w-[80px]">
                      <span className="sr-only">Ações</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                     Array.from({ length: 8 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-6 w-64" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                            <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                    ))
                  ) : themes.length > 0 ? (
                    themes.map((theme) => (
                      <TableRow key={theme.id} onClick={() => navigate(`/themes/${theme.id}`)} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">
                              <div className="font-semibold">{theme.title}</div>
                              <div className="text-xs text-muted-foreground hidden md:block max-w-lg truncate">{theme.description}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{theme.video_count} vídeos</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                              {formatDistanceToNow(new Date(theme.created_at), { addSuffix: true, locale: ptBR })}
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
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/themes/${theme.id}`)}}>Ver Detalhes</DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Editar</DropdownMenuItem>
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
                        <TableCell colSpan={4}>
                            <EmptyState
                                icon={Layers}
                                title="Nenhum tema encontrado"
                                description="Adicione vídeos e a IA irá agrupá-los em temas automaticamente."
                                className="py-24"
                            />
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            {themes.length > 0 && (
                <CardFooter className="justify-between border-t pt-6">
                    <div className="text-xs text-muted-foreground">
                        Mostrando <strong>1-{themes.length}</strong> de <strong>{themes.length}</strong> temas
                    </div>
                    {/* Pagination can be implemented here when data grows */}
                </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
