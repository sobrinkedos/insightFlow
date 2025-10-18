import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth-context";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";

const shareVideoSchema = z.object({
  url: z.string().url({ message: "Por favor, insira uma URL válida." }),
});

type ShareVideoFormValues = z.infer<typeof shareVideoSchema>;

interface ShareVideoDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ShareVideoDialog({ open: controlledOpen, onOpenChange }: ShareVideoDialogProps = {}) {
  const { user } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const form = useForm<ShareVideoFormValues>({
    resolver: zodResolver(shareVideoSchema),
    defaultValues: {
      url: "",
    },
  });

  // Verifica se há uma URL compartilhada no localStorage
  useEffect(() => {
    const sharedUrl = localStorage.getItem('sharedVideoUrl');
    if (sharedUrl) {
      form.setValue('url', sharedUrl);
      setOpen(true);
      localStorage.removeItem('sharedVideoUrl');
      localStorage.removeItem('sharedVideoTitle');
      
      toast.info('URL do vídeo compartilhado carregada!');
    }
  }, [form]);

  const onSubmit = async (data: ShareVideoFormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para compartilhar um vídeo.");
      return;
    }

    setLoading(true);

    // 1. Insert the video with "Processando" status
    const { data: newVideo, error: insertError } = await supabase
      .from("videos")
      .insert({ url: data.url, user_id: user.id, status: "Processando" })
      .select("id")
      .single();

    if (insertError || !newVideo) {
      setLoading(false);
      toast.error("Falha ao adicionar o vídeo. Tente novamente.");
      console.error("Error inserting video:", insertError);
      return;
    }

    // 2. Invoke the Edge Function to process the video in the background
    const { error: functionError } = await supabase.functions.invoke('process-video', {
      body: { video_id: newVideo.id },
    });

    setLoading(false);

    if (functionError) {
      toast.error("O processamento da IA falhou em iniciar.");
      console.error("Error invoking function:", functionError);
      // Update video status to 'Falha'
      await supabase
        .from("videos")
        .update({ status: "Falha" })
        .eq("id", newVideo.id);
    } else {
      toast.success("Vídeo adicionado! Processamento iniciado com sucesso.");
    }

    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button id="share-video-trigger" size="sm" className="text-xs md:text-sm">
          <Plus className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Compartilhar Vídeo</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Compartilhar Vídeo</DialogTitle>
          <DialogDescription>
            Cole a URL do vídeo que você deseja analisar. Ele será adicionado à sua fila.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Vídeo</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Adicionar à Fila
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
