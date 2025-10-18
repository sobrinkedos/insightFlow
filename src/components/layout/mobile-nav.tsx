import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Menu,
  Home,
  FolderOpen,
  Video,
  Heart,
  Download,
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { useState } from "react";

export function MobileNav() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Você saiu da sua conta.");
    setOpen(false);
    navigate('/');
  };

  const getAvatarFallback = (email: string | undefined) => {
    if (!email) return "U";
    return email.slice(0, 2).toUpperCase();
  };

  const handleNavClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px]">
        <SheetHeader>
          <SheetTitle className="text-left">
            <Link to="/" className="flex items-center space-x-2" onClick={handleNavClick}>
              <span className="font-bold text-lg">InsightShare</span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full py-6">
          {user && (
            <>
              <div className="flex items-center gap-3 px-2 py-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.user_metadata.avatar_url} alt={user.email || ''} />
                  <AvatarFallback>{getAvatarFallback(user.email)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">Usuário</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                    {user.email}
                  </p>
                </div>
              </div>
              <Separator className="my-2" />
            </>
          )}

          <nav className="flex flex-col gap-1 flex-1">
            <NavLink
              to="/"
              end
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              <Home className="h-5 w-5" />
              Início
            </NavLink>

            {user && (
              <>
                <NavLink
                  to="/themes"
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`
                  }
                >
                  <FolderOpen className="h-5 w-5" />
                  Meus Temas
                </NavLink>

                <NavLink
                  to="/videos"
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`
                  }
                >
                  <Video className="h-5 w-5" />
                  Vídeos Recentes
                </NavLink>

                <NavLink
                  to="/favorites"
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`
                  }
                >
                  <Heart className="h-5 w-5" />
                  Favoritos
                </NavLink>
              </>
            )}

            <NavLink
              to="/extensions"
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              <Download className="h-5 w-5" />
              Extensões
            </NavLink>

            <Separator className="my-2" />

            {user ? (
              <>
                <button
                  onClick={handleNavClick}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <User className="h-5 w-5" />
                  Perfil
                </button>

                <button
                  onClick={handleNavClick}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Settings className="h-5 w-5" />
                  Configurações
                </button>

                <button
                  onClick={() => {
                    setTheme(theme === 'dark' ? 'light' : 'dark');
                  }}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
                </button>

                <Separator className="my-2" />

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  Sair
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-auto">
                <Button onClick={() => { navigate('/login'); handleNavClick(); }} variant="outline" className="w-full">
                  Login
                </Button>
                <Button onClick={() => { navigate('/signup'); handleNavClick(); }} className="w-full">
                  Cadastre-se
                </Button>
              </div>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
