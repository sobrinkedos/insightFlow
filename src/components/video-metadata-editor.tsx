import { useState, useEffect } from "react";
import { Pencil, Save, X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { Video, Theme } from "@/types/database";
import { useAuth } from "@/contexts/auth-context";

interface VideoMetadataEditorProps {
  video: Video;
  onUpdate: (updatedVideo: Video) => void;
}

export function VideoMetadataEditor({ video, onUpdate }: VideoMetadataEditorProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [themes, setThemes] = useState<Theme[]>([]);
  
  // Estados para edição
  const [category, setCategory] = useState(video.category || "");
  const [subcategory, setSubcategory] = useState(video.subcategory || "");
  const [themeId, setThemeId] = useState(video.theme_id || "none");
  const [topics, setTopics] = useState<string[]>(video.topics || []);
  const [keywords, setKeywords] = useState<string[]>(video.keywords || []);
  const [newTopic, setNewTopic] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  // Carregar temas do usuário
  useEffect(() => {
    if (open && user) {
      loadThemes();
    }
  }, [open, user]);

  const loadThemes = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('themes')
      .select('*')
      .eq('user_id', user.id)
      .order('title');
    
    if (!error && data) {
      setThemes(data);
    }
  };

  const handleAddTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setTopics(topics.filter(t => t !== topic));
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      const updates: Partial<Video> = {
        category: category || null,
        subcategory: subcategory || null,
        theme_id: themeId && themeId !== 'none' ? themeId : null,
        topics: topics.length > 0 ? topics : null,
        keywords: keywords.length > 0 ? keywords : null,
      };

      const { data, error } = await supabase
        .from('videos')
        .update(updates)
        .eq('id', video.id)
        .select()
        .single();

      if (error) throw error;

      onUpdate(data);
      toast.success('Metadados atualizados com sucesso!');
      setOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar metadados:', error);
      toast.error('Erro ao atualizar metadados');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCategory(video.category || "");
    setSubcategory(video.subcategory || "");
    setThemeId(video.theme_id || "none");
    setTopics(video.topics || []);
    setKeywords(video.keywords || []);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="mr-2 h-4 w-4" />
          Editar Metadados
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Metadados do Vídeo</DialogTitle>
          <DialogDescription>
            Personalize a categoria, tema, tópicos e palavras-chave deste vídeo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Categoria */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: Tecnologia, Educação, Negócios..."
            />
          </div>

          {/* Subcategoria */}
          <div className="space-y-2">
            <Label htmlFor="subcategory">Subcategoria</Label>
            <Input
              id="subcategory"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              placeholder="Ex: Programação, Marketing Digital..."
            />
          </div>

          {/* Tema */}
          <div className="space-y-2">
            <Label htmlFor="theme">Tema</Label>
            <Select value={themeId} onValueChange={setThemeId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tema (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum tema</SelectItem>
                {themes.map((theme) => (
                  <SelectItem key={theme.id} value={theme.id}>
                    {theme.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tópicos */}
          <div className="space-y-2">
            <Label>Tópicos</Label>
            <div className="flex gap-2">
              <Input
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTopic())}
                placeholder="Adicionar novo tópico..."
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddTopic}
                disabled={!newTopic.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {topics.map((topic, i) => (
                <Badge key={i} variant="secondary" className="gap-1">
                  {topic}
                  <button
                    onClick={() => handleRemoveTopic(topic)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {topics.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum tópico adicionado</p>
              )}
            </div>
          </div>

          {/* Palavras-chave */}
          <div className="space-y-2">
            <Label>Palavras-chave</Label>
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                placeholder="Adicionar nova palavra-chave..."
              />
              <Button
                type="button"
                size="sm"
                onClick={handleAddKeyword}
                disabled={!newKeyword.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {keywords.map((keyword, i) => (
                <Badge key={i} variant="outline" className="gap-1">
                  {keyword}
                  <button
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {keywords.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma palavra-chave adicionada</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={loading}
          >
            Resetar
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>Salvando...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
