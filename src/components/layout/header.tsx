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

  const handleSignOut = async () => {
    await signOut();
    toast.success("Você saiu da sua conta.");
    navigate('/');
  };

  const getAvatarFallback = (email: string | undefined) => {
    if (!email) return "U";
    return email.slice(0, 2).toUpperCase();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 md:h-16 items-center px-4">
        <MobileNav />
        
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="font-bold">
              InsightShare
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-sm lg:gap-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `transition-colors hover:text-foreground/80 ${isActive ? "text-foreground" : "text-foreground/60"}`
              }
            >
              Início
            </NavLink>
            {user && (
              <>
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
              </>
            )}
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
        </div>
        <Link to="/" className="flex md:hidden items-center space-x-2 flex-1">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span className="font-bold text-base">
            InsightShare
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-2 md:justify-end">
          <div className="hidden md:block w-full flex-1 md:w-auto md:flex-none">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Pesquisar..."
                  className="w-full bg-background pl-8 md:w-[200px] lg:w-[336px]"
                />
              </div>
            </form>
          </div>
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : user ? (
            <>
              <MobileSearch />
              <div className="hidden md:block">
                <ShareVideoDialog />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-9 w-9">
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
    </header>
  );
}
