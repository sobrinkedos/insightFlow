import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Calendar,
  Video,
  Layers,
  Heart,
  TrendingUp,
  Clock,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "@/lib/date-utils";
import { toast } from "sonner";

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

type Profile = {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  website: string | null;
  updated_at: string | null;
};

type Stats = {
  totalVideos: number;
  totalThemes: number;
  favorites: number;
  watchedVideos: number;
  videosThisMonth: number;
  themesThisMonth: number;
};

export function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalVideos: 0,
    totalThemes: 0,
    favorites: 0,
    watchedVideos: 0,
    videosThisMonth: 0,
    themesThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    website: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else {
      setProfile(data);
      setFormData({
        full_name: data.full_name || "",
        username: data.username || "",
        website: data.website || "",
      });
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    if (!user) return;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      { count: totalVideos },
      { count: totalThemes },
      { count: favorites },
      { count: watchedVideos },
      { count: videosThisMonth },
      { count: themesThisMonth },
    ] = await Promise.all([
      supabase
        .from("videos")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("themes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("videos")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_favorite", true),
      supabase
        .from("video_progress")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gt("watched_time", 0),
      supabase
        .from("videos")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", startOfMonth.toISOString()),
      supabase
        .from("themes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", startOfMonth.toISOString()),
    ]);

    setStats({
      totalVideos: totalVideos || 0,
      totalThemes: totalThemes || 0,
      favorites: favorites || 0,
      watchedVideos: watchedVideos || 0,
      videosThisMonth: videosThisMonth || 0,
      themesThisMonth: themesThisMonth || 0,
    });
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: formData.full_name || null,
        username: formData.username || null,
        website: formData.website || null,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      toast.error("Erro ao salvar perfil");
      console.error("Error updating profile:", error);
    } else {
      toast.success("Perfil atualizado com sucesso!");
      setEditing(false);
      fetchProfile();
    }
    setSaving(false);
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (profile?.username) {
      return profile.username.slice(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  if (loading) {
    return (
      <div className="w-full py-12">
        <div className="px-4 md:max-w-5xl md:mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-mesh-gradient opacity-50" />
      <div className="fixed inset-0 -z-10 bg-pattern-dots" />
      <div className="w-full py-6 md:py-12 relative">
        <motion.div
          className="md:max-w-5xl md:mx-auto px-4"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Meu Perfil
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie suas informações pessoais e veja suas estatísticas
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Card */}
            <Card className="glass border-border/50 lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Informações</span>
                  {!editing ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditing(true)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditing(false);
                          setFormData({
                            full_name: profile?.full_name || "",
                            username: profile?.username || "",
                            website: profile?.website || "",
                          });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="text-2xl bg-gradient-primary text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  {!editing && (
                    <div className="text-center">
                      <h3 className="text-xl font-semibold">
                        {profile?.full_name || profile?.username || "Usuário"}
                      </h3>
                      {profile?.username && profile?.full_name && (
                        <p className="text-sm text-muted-foreground">
                          @{profile.username}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <Separator />

                {editing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Nome Completo</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) =>
                          setFormData({ ...formData, full_name: e.target.value })
                        }
                        placeholder="Seu nome"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Nome de Usuário</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        placeholder="@usuario"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={formData.website}
                        onChange={(e) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">
                        {user?.email}
                      </span>
                    </div>
                    {profile?.website && (
                      <div className="flex items-center gap-3 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate"
                        >
                          {profile.website}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Membro desde{" "}
                        {user?.created_at
                          ? formatDistanceToNow(new Date(user.created_at), {
                              addSuffix: true,
                            })
                          : "recentemente"}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Estatísticas Gerais
                  </CardTitle>
                  <CardDescription>
                    Seu progresso e atividade na plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Video className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          Vídeos
                        </span>
                      </div>
                      <p className="text-2xl font-bold">{stats.totalVideos}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Layers className="h-4 w-4 text-purple-500" />
                        <span className="text-sm text-muted-foreground">
                          Temas
                        </span>
                      </div>
                      <p className="text-2xl font-bold">{stats.totalThemes}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-pink-500/5 border border-pink-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="h-4 w-4 text-pink-500" />
                        <span className="text-sm text-muted-foreground">
                          Favoritos
                        </span>
                      </div>
                      <p className="text-2xl font-bold">{stats.favorites}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-muted-foreground">
                          Assistidos
                        </span>
                      </div>
                      <p className="text-2xl font-bold">
                        {stats.watchedVideos}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Video className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">
                          Este mês
                        </span>
                      </div>
                      <p className="text-2xl font-bold">
                        {stats.videosThisMonth}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-orange-500/5 border border-orange-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Layers className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-muted-foreground">
                          Temas/mês
                        </span>
                      </div>
                      <p className="text-2xl font-bold">
                        {stats.themesThisMonth}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Conquistas</CardTitle>
                  <CardDescription>
                    Marcos alcançados na sua jornada
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.totalVideos >= 10 && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                        <div className="text-2xl">🎬</div>
                        <div>
                          <p className="font-semibold">Colecionador</p>
                          <p className="text-xs text-muted-foreground">
                            10+ vídeos adicionados
                          </p>
                        </div>
                      </div>
                    )}
                    {stats.totalThemes >= 5 && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                        <div className="text-2xl">📚</div>
                        <div>
                          <p className="font-semibold">Organizador</p>
                          <p className="text-xs text-muted-foreground">
                            5+ temas criados
                          </p>
                        </div>
                      </div>
                    )}
                    {stats.watchedVideos >= 20 && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                        <div className="text-2xl">👀</div>
                        <div>
                          <p className="font-semibold">Espectador Ávido</p>
                          <p className="text-xs text-muted-foreground">
                            20+ vídeos assistidos
                          </p>
                        </div>
                      </div>
                    )}
                    {stats.favorites >= 5 && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/20">
                        <div className="text-2xl">❤️</div>
                        <div>
                          <p className="font-semibold">Curador</p>
                          <p className="text-xs text-muted-foreground">
                            5+ vídeos favoritos
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {stats.totalVideos < 10 &&
                    stats.totalThemes < 5 &&
                    stats.watchedVideos < 20 &&
                    stats.favorites < 5 && (
                      <div className="text-center py-8 text-muted-foreground">
                        Continue usando o InsightShare para desbloquear
                        conquistas!
                      </div>
                    )}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
