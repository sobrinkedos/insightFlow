import { NavLink } from "react-router-dom";
import { Home, FolderOpen, Video, Heart, Plus } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { ShareVideoDialog } from "../share-video-dialog";
import { useState } from "react";

export function BottomNav() {
  const { user } = useAuth();
  const [shareOpen, setShareOpen] = useState(false);

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user) return null;

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 border-t border-border/40 md:hidden print:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-around h-16 px-2">
          <NavLink
            to="/"
            end
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[64px] ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium">Início</span>
          </NavLink>

          <NavLink
            to="/themes"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[64px] ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <FolderOpen className="h-5 w-5" />
            <span className="text-xs font-medium">Temas</span>
          </NavLink>

          <button
            onClick={() => setShareOpen(true)}
            className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[64px] -mt-6 group"
          >
            <div className="bg-gradient-primary text-primary-foreground rounded-full p-3 shadow-glow group-hover:shadow-glow-lg transition-all group-hover:scale-110">
              <Plus className="h-6 w-6" />
            </div>
          </button>

          <NavLink
            to="/videos"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[64px] ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Video className="h-5 w-5" />
            <span className="text-xs font-medium">Vídeos</span>
          </NavLink>

          <NavLink
            to="/favorites"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[64px] ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Heart className="h-5 w-5" />
            <span className="text-xs font-medium">Favoritos</span>
          </NavLink>
        </div>
      </nav>

      {/* Dialog só renderiza em mobile */}
      <div className="md:hidden">
        <ShareVideoDialog open={shareOpen} onOpenChange={setShareOpen} />
      </div>
    </>
  );
}
