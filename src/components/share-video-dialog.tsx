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

  // Helper function to detect platform
  const detectPlatform = (url: string): 'youtube' | 'instagram' | 'other' => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        return 'youtube';
      }
      if (urlObj.hostname.includes('instagram.com')) {
        return 'instagram';
      }
      return 'other';
    } catch {
      return 'other';
    }
  };

  // Helper function to clean Instagram URL
  const cleanInstagramUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('instagram.com')) {
        const match = urlObj.pathname.match(/(\/(?:p|reel|tv)\/[^\/\?]+)/);
        if (match) {
          return `https://www.instagram.com${match[1]}/`;
        }
      }
      return url;
    } catch {
      return url;
    }
  };

  // Helper function to fetch Instagram data via RapidAPI
  const fetchInstagramData = async (url: string) => {
    try {
      console.log("📡 [SHARE] Fetching Instagram data via RapidAPI...");
      
      const RAPIDAPI_KEY = '5b4ef30d7amsh604c58627ce5d90p18121bjsnbc0f5b169f67';
      const RAPIDAPI_HOST = 'instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com';
      
      const apiUrl = `https://${RAPIDAPI_HOST}/convert?url=${encodeURIComponent(url)}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': RAPIDAPI_HOST,
          'x-rapidapi-key': RAPIDAPI_KEY
        }
      });
      
      if (!response.ok) {
        console.warn("⚠️ [SHARE] RapidAPI returned error:", response.status);
        return null;
      }
      
      const data = await response.json();
      console.log("✅ [SHARE] RapidAPI response received");
      
      let videoUrl = '';
      let thumbnailUrl = '';
      let title = 'Post do Instagram';
      
      if (data.media && Array.isArray(data.media) && data.media.length > 0) {
        const firstMedia = data.media[0];
        
        if (firstMedia.type === 'video') {
          videoUrl = firstMedia.url || '';
          thumbnailUrl = firstMedia.thumbnail || '';
        } else if (firstMedia.type === 'image') {
          thumbnailUrl = firstMedia.url || firstMedia.thumbnail || '';
        }
      }
      
      return {
        videoUrl: videoUrl || undefined,
        thumbnailUrl: thumbnailUrl || undefined,
        title
      };
    } catch (error) {
      console.error("❌ [SHARE] Error fetching Instagram data:", error);
      return null;
    }
  };

  const onSubmit = async (data: ShareVideoFormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para compartilhar um vídeo.");
      return;
    }

    setLoading(true);

    console.log("🎬 [SHARE] Starting video share process...");
    console.log("🎬 [SHARE] URL:", data.url);

    const platform = detectPlatform(data.url);
    console.log("🔍 [SHARE] Platform detected:", platform);

    let videoPayload: any = {
      url: data.url,
      user_id: user.id,
      status: "Processando"
    };

    // For Instagram, fetch data via RapidAPI first (like extension does)
    if (platform === 'instagram') {
      const cleanUrl = cleanInstagramUrl(data.url);
      console.log("🧹 [SHARE] Cleaned URL:", cleanUrl);
      
      toast.info("Buscando informações do Instagram...");
      
      const instagramData = await fetchInstagramData(cleanUrl);
      
      if (instagramData) {
        console.log("✅ [SHARE] Instagram data fetched successfully");
        
        // Add Instagram data to payload (like extension does)
        videoPayload.url = cleanUrl; // Use cleaned URL
        if (instagramData.title) {
          videoPayload.title = instagramData.title;
        }
        if (instagramData.videoUrl) {
          videoPayload.video_url = instagramData.videoUrl;
          console.log("✅ [SHARE] video_url added to payload");
        }
        if (instagramData.thumbnailUrl) {
          videoPayload.thumbnail_url = instagramData.thumbnailUrl;
          console.log("✅ [SHARE] thumbnail_url added to payload");
        }
      } else {
        console.warn("⚠️ [SHARE] Failed to fetch Instagram data, will try via Edge Function");
      }
    }

    console.log("📤 [SHARE] Inserting video with payload:", {
      url: videoPayload.url,
      has_video_url: !!videoPayload.video_url,
      has_thumbnail_url: !!videoPayload.thumbnail_url
    });

    // 1. Insert the video with data
    const { data: newVideo, error: insertError } = await supabase
      .from("videos")
      .insert(videoPayload)
      .select("id")
      .single();

    if (insertError || !newVideo) {
      setLoading(false);
      toast.error("Falha ao adicionar o vídeo. Tente novamente.");
      console.error("❌ [SHARE] Error inserting video:", insertError);
      return;
    }

    console.log("✅ [SHARE] Video inserted with ID:", newVideo.id);
    console.log("🚀 [SHARE] Invoking Edge Function...");

    // 2. Invoke the Edge Function to process the video in the background
    const { error: functionError } = await supabase.functions.invoke('process-video', {
      body: { video_id: newVideo.id },
    });

    setLoading(false);

    if (functionError) {
      toast.error("O processamento da IA falhou em iniciar.");
      console.error("❌ [SHARE] Error invoking function:", functionError);
      // Update video status to 'Falha'
      await supabase
        .from("videos")
        .update({ status: "Falha" })
        .eq("id", newVideo.id);
    } else {
      console.log("✅ [SHARE] Edge Function invoked successfully!");
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
