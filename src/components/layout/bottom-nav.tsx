import { NavLink } from "react-router-dom";
import { Home, FolderOpen, Video, Heart, Plus } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { ShareVideoDialog } from "../share-video-dialog";
import { useState } from "react";

export function BottomNav() {
  const { user } = useAuth();
  const [shareOpen, setShareOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border/40 md:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          <NavLink
            to="/"
            end
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
            className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[64px] -mt-6"
          >
            <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg">
              <Plus className="h-6 w-6" />
            </div>
          </button>

          <NavLink
            to="/videos"
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

      <ShareVideoDialog open={shareOpen} onOpenChange={setShareOpen} />
    </>
  );
}
