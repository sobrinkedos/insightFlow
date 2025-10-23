import { useState, FormEvent, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BrainCircuit, Search, User, LogOut, Settings, Moon, Sun, Loader2, Download } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { ShareVideoDialog } from "../share-video-dialog";
import { MobileNav } from "./mobile-nav";
import { MobileSearch } from "./mobile-search";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Você saiu da sua conta.");
    navigate('/');
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getAvatarFallback = (email: string | undefined) => {
    if (!email) return "U";
    return email.slice(0, 2).toUpperCase();
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300 ${
      isScrolled 
        ? "border-border/60 bg-background/95 backdrop-blur-2xl shadow-lg" 
        : "border-border/40 bg-background/80 backdrop-blur-xl shadow-sm"
    } supports-[backdrop-filter]:bg-background/60`}>
      <div className="container px-4">
        {/* Primeira linha: Logo, Busca e Ações do Usuário */}
        <div className="flex h-14 md:h-14 items-center">
          <MobileNav />
          
          <Link to="/" className="flex items-center space-x-2 mr-4 group">
            <div className="relative">
              <BrainCircuit className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-bold text-base md:text-base bg-gradient-primary bg-clip-text text-transparent">
              InsightShare
            </span>
          </Link>

          <div className="flex flex-1 items-center justify-end gap-2 min-w-0">
            {user && (
              <div className="hidden md:block md:w-auto md:flex-none">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Pesquisar vídeos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-[200px] lg:w-[300px] bg-card/50 border-border/50 pl-8 focus:border-primary/50 transition-colors"
                    />
                  </div>
                </form>
              </div>
            )}
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin flex-shrink-0" />
            ) : user ? (
              <>
                <MobileSearch />
                <div className="hidden md:block">
                  <ShareVideoDialog />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full flex-shrink-0">
                      <Avatar className="h-8 w-8 md:h-9 md:w-9">
                        <AvatarImage src={user.user_metadata.avatar_url} alt={user.email || ''} />
                        <AvatarFallback>{getAvatarFallback(user.email)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Usuário</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                      {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                      <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
                <Button onClick={() => navigate('/signup')}>Cadastre-se</Button>
              </div>
            )}
          </div>
        </div>

        {/* Segunda linha: Menu de Navegação (apenas desktop) */}
        {user && (
          <nav className="hidden md:flex items-center justify-end gap-6 text-sm h-10 border-t border-border/40">
            <NavLink
              to="/themes"
              className={({ isActive }) =>
                `transition-colors hover:text-foreground/80 ${isActive ? "text-foreground" : "text-foreground/60"}`
              }
            >
              Meus Temas
            </NavLink>
            <NavLink
              to="/videos"
              className={({ isActive }) =>
                `transition-colors hover:text-foreground/80 ${isActive ? "text-foreground" : "text-foreground/60"}`
              }
            >
              Vídeos Recentes
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `transition-colors hover:text-foreground/80 ${isActive ? "text-foreground" : "text-foreground/60"}`
              }
            >
              Favoritos
            </NavLink>
            <NavLink
              to="/extensions"
              className={({ isActive }) =>
                `transition-colors hover:text-foreground/80 flex items-center gap-1 ${isActive ? "text-foreground" : "text-foreground/60"}`
              }
            >
              <Download className="h-3.5 w-3.5" />
              Extensões
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
}
