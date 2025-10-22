# 📝 Código Corrigido - index.ts

## ⚠️ IMPORTANTE: Use este código no lugar do anterior

O código anterior tinha um problema de sintaxe com template strings. Use este:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { ANALYSIS_PROMPT } from "./ai-prompts.ts";
import { instagramAPI } from "./instagram-api.ts";

const openAIKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function extractVideoId(url: string): { id: string; platform: string } | null {
  try {
    const urlObj = new URL(url);

    if (urlObj.hostname.includes('youtube.com')) {
      const id = urlObj.searchParams.get('v');
      return id ? { id, platform: 'youtube' } : null;
    } else if (urlObj.hostname.includes('youtu.be')) {
      const id = urlObj.pathname.slice(1).split('?')[0];
      return id ? { id, platform: 'youtube' } : null;
    }

    if (urlObj.hostname.includes('instagram.com')) {
      const match = urlObj.pathname.match(/\/(p|reel|tv)\/([^\/\?]+)/);
      if (match) {
        return { id: match[2], platform: 'instagram' };
      }
    }

    return null;
  } catch {
    return null;
  }
}

async function getVideoInfo(videoId: string, platform: string, fullUrl: string): Promise<{ title: string; description: string; videoUrl?: string; thumbnailUrl?: string } | null> {
  try {
    if (platform === 'youtube') {
      const youtubeApiKey = Deno.env.get("YOUTUBE_API_KEY");
      if (!youtubeApiKey) {
        console.warn("YOUTUBE_API_KEY not set, skipping video info fetch");
        return null;
      }

      const youtubeUrl = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoId + "&key=" + youtubeApiKey;
      const response = await fetch(youtubeUrl);

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const snippet = data.items[0].snippet;
        return {
          title: snippet.title,
          description: snippet.description,
        };
      }
    } else if (platform === 'instagram') {
      try {
        const postInfo = await instagramAPI.getPostInfo(fullUrl);

        if (postInfo && postInfo.description && postInfo.description.length > 50) {
          console.log("Instagram API response:", postInfo);
          return {
            title: postInfo.title,
            description: postInfo.description,
          };
        }
      } catch (error) {
        console.warn("Instagram RapidAPI failed:", error);
      }

      console.warn("Using Instagram fallback with generic info");
      return {
        title: "Conteúdo do Instagram",
        description: "Post do Instagram. Link: " + fullUrl + ".",
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching video info:", error);
    return null;
  }
}

async function transcribeVideoWithWhisper(videoUrl: string): Promise<string | null> {
  if (!openAIKey) {
    console.warn("OPENAI_API_KEY not configured, skipping Whisper transcription");
    return null;
  }

  try {
    console.log("Starting Whisper transcription for video:", videoUrl.substring(0, 100));
    
    console.log("Downloading video...");
    const videoResponse = await fetch(videoUrl);
    
    if (!videoResponse.ok) {
      console.error("Failed to download video:", videoResponse.status);
      return null;
    }
    
    const videoBlob = await videoResponse.blob();
    const videoSize = videoBlob.size / (1024 * 1024);
    console.log("Video downloaded:", videoSize.toFixed(2), "MB");
    
    if (videoSize > 25) {
      console.warn("Video too large for Whisper API (>25MB), skipping transcription");
      return null;
    }
    
    console.log("Sending to Whisper API...");
    const formData = new FormData();
    formData.append('file', videoBlob, 'video.mp4');
    formData.append('model', 'whisper-1');
    formData.append('language', 'pt');
    formData.append('response_format', 'text');
    
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + openAIKey,
      },
      body: formData,
    });
    
    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text();
      console.error("Whisper API error:", whisperResponse.status, errorText);
      return null;
    }
    
    const transcription = await whisperResponse.text();
    console.log("Transcription completed:", transcription.length, "characters");
    console.log("Preview:", transcription.substring(0, 200));
    
    return transcription;
  } catch (error) {
    console.error("Error in Whisper transcription:", error);
    return null;
  }
}

async function analyzeWithGPT(transcription: string, videoTitle: string): Promise<any> {
  if (!openAIKey) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + openAIKey,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: ANALYSIS_PROMPT,
        },
        {
          role: "user",
          content: "Título do vídeo: " + videoTitle + "\n\nTranscrição/Descrição:\n" + transcription,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error("OpenAI API error: " + error);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  return JSON.parse(content);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { video_id } = await req.json();

    if (!video_id) {
      throw new Error("video_id is required.");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: video, error: videoError} = await supabaseAdmin
      .from("videos")
      .select("id, url, user_id, video_url, thumbnail_url")
      .eq("id", video_id)
      .single();

    if (videoError || !video) {
      throw new Error("Video not found: " + (videoError?.message || ""));
    }
    
    console.log("Video data from DB - URL:", video.url);
    console.log("Has video_url:", !!video.video_url);
    console.log("Has thumbnail_url:", !!video.thumbnail_url);

    const videoData = extractVideoId(video.url);
    if (!videoData) {
      throw new Error("URL de vídeo inválida ou plataforma não suportada");
    }

    const { id: videoId, platform } = videoData;

    let videoUrl: string | undefined = video.video_url || undefined;
    let thumbnailUrl: string | undefined = video.thumbnail_url || undefined;
    
    console.log("Video URL from database:", videoUrl ? "Found" : "Not found");
    
    let videoInfo = await getVideoInfo(videoId, platform, video.url);
    
    if (!videoInfo) {
      const platformName = platform === 'youtube' ? 'YouTube' : 'Instagram';
      const linkText = platform === 'youtube' ? "Link: https://www.youtube.com/watch?v=" + videoId + ". Configure YOUTUBE_API_KEY para obter mais informações." : "Link: " + video.url;
      videoInfo = {
        title: "Vídeo do " + platformName,
        description: "Análise de vídeo do " + platformName + ". " + linkText,
      };
    } else {
      if (!videoUrl && videoInfo.videoUrl) {
        videoUrl = videoInfo.videoUrl;
        console.log("Got videoUrl from API");
      }
      if (!thumbnailUrl && videoInfo.thumbnailUrl) {
        thumbnailUrl = videoInfo.thumbnailUrl;
        console.log("Got thumbnailUrl from API");
      }
    }

    let transcription = videoInfo.description || "Sem descrição disponível";
    
    if (platform === 'instagram' && videoUrl) {
      console.log("Instagram video detected with URL, attempting Whisper transcription...");
      console.log("Video URL:", videoUrl.substring(0, 100) + "...");
      
      const whisperTranscription = await transcribeVideoWithWhisper(videoUrl);
      
      if (whisperTranscription && whisperTranscription.length > 50) {
        console.log("Using Whisper transcription:", whisperTranscription.length, "characters");
        transcription = whisperTranscription;
      } else {
        console.log("Whisper transcription failed or too short, using fallback");
      }
    } else if (platform === 'instagram' && !videoUrl) {
      console.warn("Instagram video but no video_url available");
    }

    let contextualTranscription = transcription;
    if (platform === 'instagram' && transcription.length < 150) {
      contextualTranscription = "[IMPORTANTE: Este é um vídeo do Instagram. O Instagram não fornece legendas ou descrições automáticas, então as informações são muito limitadas. \n\nINSTRUÇÕES ESPECIAIS:\n- Crie um resumo genérico mas útil indicando que é um vídeo do Instagram\n- Use categoria \"Redes Sociais\" ou \"Conteúdo Visual\"\n- Adicione palavras-chave relacionadas a Instagram e mídia social\n- No resumo, mencione que para análise completa é necessário assistir ao vídeo\n- Seja honesto sobre a limitação de informações disponíveis]\n\nInformações disponíveis:\n" + transcription;
    }

    const analysis = await analyzeWithGPT(contextualTranscription, videoInfo.title);

    const processedData = {
      title: analysis.title || videoInfo.title,
      transcription: transcription,
      summary_short: analysis.summary_short,
      summary_expanded: analysis.summary_expanded,
      topics: analysis.topics || [],
      keywords: analysis.keywords || [],
      category: analysis.category,
      subcategory: analysis.subcategory,
      is_tutorial: analysis.is_tutorial || false,
      tutorial_steps: analysis.tutorial_steps || null,
    };

    const updateData: any = {
      status: "Concluído",
      title: processedData.title,
      transcription: processedData.transcription,
      summary_short: processedData.summary_short,
      summary_expanded: processedData.summary_expanded,
      topics: processedData.topics,
      keywords: processedData.keywords,
      category: processedData.category,
      subcategory: processedData.subcategory,
      is_tutorial: processedData.is_tutorial,
      tutorial_steps: processedData.tutorial_steps,
      processed_at: new Date().toISOString(),
    };
    
    if (videoUrl) {
      updateData.video_url = videoUrl;
      console.log("Saving video_url:", videoUrl.substring(0, 100));
    }
    if (thumbnailUrl) {
      updateData.thumbnail_url = thumbnailUrl;
      console.log("Saving thumbnail_url:", thumbnailUrl.substring(0, 100));
    }
    
    const { error: updateError } = await supabaseAdmin
      .from("videos")
      .update(updateData)
      .eq("id", video_id);

    if (updateError) {
      await supabaseAdmin
        .from("videos")
        .update({ status: "Falha" })
        .eq("id", video_id);
      throw new Error("Failed to update video: " + updateError.message);
    }

    if (processedData.category) {
      try {
        const { data: existingTheme } = await supabaseAdmin
          .from("themes")
          .select("id")
          .eq("user_id", video.user_id)
          .eq("title", processedData.category)
          .single();

        let themeId: string;

        if (existingTheme) {
          themeId = existingTheme.id;
          console.log("Using existing theme:", themeId);
        } else {
          const { data: newTheme, error: themeError } = await supabaseAdmin
            .from("themes")
            .insert({
              user_id: video.user_id,
              title: processedData.category,
              description: processedData.subcategory || processedData.summary_short,
              keywords: processedData.keywords,
            })
            .select("id")
            .single();

          if (themeError) {
            console.error("Error creating theme:", themeError);
            throw themeError;
          }

          themeId = newTheme.id;
          console.log("Created new theme:", themeId);
        }

        const { data: existingLink } = await supabaseAdmin
          .from("theme_videos")
          .select("*")
          .eq("theme_id", themeId)
          .eq("video_id", video_id)
          .single();

        if (!existingLink) {
          const { error: linkError } = await supabaseAdmin
            .from("theme_videos")
            .insert({
              theme_id: themeId,
              video_id: video_id,
            });

          if (linkError) {
            console.error("Error linking video to theme:", linkError);
            throw linkError;
          }

          console.log("Linked video", video_id, "to theme", themeId);
        } else {
          console.log("Video", video_id, "already linked to theme", themeId);
        }
      } catch (error) {
        console.error("Error in theme creation/linking:", error);
      }
    }

    return new Response(JSON.stringify({ message: "Video processed successfully" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing video:", error);

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
```

## 🔧 O que foi corrigido:

Substituí todos os template strings (backticks) por concatenação normal:

**ANTES (causava erro):**
```typescript
`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeApiKey}`
```

**DEPOIS (funciona):**
```typescript
"https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoId + "&key=" + youtubeApiKey
```

## ✅ Agora pode fazer o deploy!

Cole este código no dashboard e clique em Deploy. Deve funcionar! 🚀
