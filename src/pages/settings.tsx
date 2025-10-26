import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Bell,
  Shield,
  Trash2,
  LogOut,
  Download,
  Database,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Detectar tema atual
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
    toast.success(`Tema ${newTheme === "dark" ? "escuro" : "claro"} ativado`);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Você saiu da sua conta");
    navigate("/login");
  };

  const handleExportData = async () => {
    if (!user) return;

    try {
      toast.loading("Exportando seus dados...");

      const [{ data: videos }, { data: themes }, { data: progress }] =
        await Promise.all([
          supabase.from("videos").select("*").eq("user_id", user.id),
          supabase.from("themes").select("*").eq("user_id", user.id),
          supabase.from("video_progress").select("*").eq("user_id", user.id),
        ]);

      const exportData = {
        exported_at: new Date().toISOString(),
        user_id: user.id,
        videos: videos || [],
        themes: themes || [],
        progress: progress || [],
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `insightshare-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success("Dados exportados com sucesso!");
    } catch (error) {
      toast.dismiss();
      toast.error("Erro ao exportar dados");
      console.error("Export error:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setDeleting(true);
    try {
      // Deletar dados do usuário
      await Promise.all([
        supabase.from("video_progress").delete().eq("user_id", user.id),
        supabase.from("videos").delete().eq("user_id", user.id),
        supabase.from("themes").delete().eq("user_id", user.id),
        supabase.from("profiles").delete().eq("id", user.id),
      ]);

      // Deletar conta
      const { error } = await supabase.auth.admin.deleteUser(user.id);

      if (error) throw error;

      toast.success("Conta deletada com sucesso");
      await signOut();
      navigate("/");
    } catch (error) {
      toast.error("Erro ao deletar conta. Entre em contato com o suporte.");
      console.error("Delete account error:", error);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-mesh-gradient opacity-50" />
      <div className="fixed inset-0 -z-10 bg-pattern-dots" />
      <div className="w-full py-6 md:py-12 relative">
        <motion.div
          className="md:max-w-4xl md:mx-auto px-4"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
              <SettingsIcon className="h-8 w-8 text-primary" />
              Configurações
            </h1>
            <p className="text-muted-foreground mt-2">
              Personalize sua experiência no InsightShare
            </p>
          </div>

          <div className="space-y-6">
            {/* Aparência */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {theme === "dark" ? (
                    <Moon className="h-5 w-5 text-primary" />
                  ) : (
                    <Sun className="h-5 w-5 text-primary" />
                  )}
                  Aparência
                </CardTitle>
                <CardDescription>
                  Personalize a aparência da interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tema</Label>
                    <p className="text-sm text-muted-foreground">
                      Escolha entre tema claro ou escuro
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleTheme}
                    className="gap-2"
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="h-4 w-4" />
                        Claro
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4" />
                        Escuro
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notificações */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notificações
                </CardTitle>
                <CardDescription>
                  Gerencie como você recebe notificações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Processamento de Vídeos</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar quando um vídeo for processado
                    </p>
                  </div>
                  <Badge variant="secondary">Em breve</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Novos Recursos</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber atualizações sobre novos recursos
                    </p>
                  </div>
                  <Badge variant="secondary">Em breve</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Privacidade e Dados */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Privacidade e Dados
                </CardTitle>
                <CardDescription>
                  Gerencie seus dados e privacidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Exportar Dados</Label>
                    <p className="text-sm text-muted-foreground">
                      Baixe uma cópia de todos os seus dados
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportData}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Armazenamento</Label>
                    <p className="text-sm text-muted-foreground">
                      Gerencie o espaço usado pelos seus dados
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Database className="h-4 w-4" />
                    Ver Uso
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Conta */}
            <Card className="glass border-border/50 border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-500">
                  <AlertTriangle className="h-5 w-5" />
                  Zona de Perigo
                </CardTitle>
                <CardDescription>
                  Ações irreversíveis relacionadas à sua conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sair da Conta</Label>
                    <p className="text-sm text-muted-foreground">
                      Desconectar desta sessão
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="gap-2 border-orange-500/50 text-orange-500 hover:bg-orange-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-red-500">Deletar Conta</Label>
                    <p className="text-sm text-muted-foreground">
                      Remover permanentemente sua conta e todos os dados
                    </p>
                  </div>
                  <Dialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-red-500/50 text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        Deletar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-500">
                          <AlertTriangle className="h-5 w-5" />
                          Deletar Conta
                        </DialogTitle>
                        <DialogDescription>
                          Esta ação é irreversível. Todos os seus vídeos, temas
                          e dados serão permanentemente removidos.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                          Tem certeza que deseja continuar? Esta ação não pode
                          ser desfeita.
                        </p>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setDeleteDialogOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteAccount}
                          disabled={deleting}
                        >
                          {deleting ? "Deletando..." : "Sim, deletar minha conta"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Sobre */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle>Sobre o InsightShare</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>Versão:</strong> 1.0.0
                </p>
                <p>
                  <strong>Desenvolvido com:</strong> React, TypeScript,
                  Supabase
                </p>
                <p className="pt-4">
                  © 2024 InsightShare. Transformando vídeos em conhecimento.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </>
  );
}
