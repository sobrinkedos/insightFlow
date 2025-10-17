import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { ANALYSIS_PROMPT } from "./ai-prompts.ts";

// IMPORTANT: Set these secrets in your Supabase project dashboard:
// `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`
// Docs: https://supabase.com/docs/guides/functions/secrets

const openAIKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper functions
function extractVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // YouTube formats: youtube.com/watch?v=ID or youtu.be/ID
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    } else if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.slice(1).split('?')[0];
    }
    
    return null;
  } catch {
    return null;
  }
}

async function getVideoInfo(videoId: string): Promise<{ title: string; description: string } | null> {
  try {
    // Usando a API do YouTube Data v3 (você precisa configurar YOUTUBE_API_KEY)
    const youtubeApiKey = Deno.env.get("YOUTUBE_API_KEY");
    if (!youtubeApiKey) {
      console.warn("YOUTUBE_API_KEY not set, skipping video info fetch");
      return null;
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeApiKey}`
    );
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const snippet = data.items[0].snippet;
      return {
        title: snippet.title,
        description: snippet.description,
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching video info:", error);
    return null;
  }
}

async function transcribeAudio(audioUrl: string): Promise<string> {
  if (!openAIKey) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  // Para transcrição real, você precisaria:
  // 1. Baixar o áudio do YouTube (usando yt-dlp ou similar)
  // 2. Enviar para a API Whisper da OpenAI
  // Por enquanto, vamos usar a descrição do vídeo como fallback
  
  throw new Error("Audio transcription not implemented yet. Use video description as fallback.");
}

async function analyzeWithGPT(transcription: string, videoTitle: string): Promise<any> {
  if (!openAIKey) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openAIKey}`,
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
          content: `Título do vídeo: ${videoTitle}\n\nTranscrição/Descrição:\n${transcription}`,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  return JSON.parse(content);
}

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
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

    // 1. Fetch video details
    const { data: video, error: videoError } = await supabaseAdmin
      .from("videos")
      .select("id, url, user_id")
      .eq("id", video_id)
      .single();

    if (videoError || !video) {
      throw new Error(`Video not found: ${videoError?.message}`);
    }

    // 2. Extract video ID from URL
    const videoId = extractVideoId(video.url);
    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    // 3. Get video info (title and description)
    let videoInfo = await getVideoInfo(videoId);
    if (!videoInfo) {
      // Fallback: usar informações básicas do vídeo
      videoInfo = {
        title: `Vídeo do YouTube`,
        description: `Análise de vídeo do YouTube. Link: https://www.youtube.com/watch?v=${videoId}. Configure YOUTUBE_API_KEY para obter mais informações.`,
      };
    }

    // 4. Use description as transcription (fallback until we implement audio transcription)
    const transcription = videoInfo.description || "Sem descrição disponível";

    // 5. Analyze with GPT
    const analysis = await analyzeWithGPT(transcription, videoInfo.title);

    // 6. Prepare the data
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

    // 7. Update the video with processed data
    const { error: updateError } = await supabaseAdmin
      .from("videos")
      .update({
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
      })
      .eq("id", video_id);

    if (updateError) {
      // If update fails, mark as failed
      await supabaseAdmin
        .from("videos")
        .update({ status: "Falha" })
        .eq("id", video_id);
      throw new Error(`Failed to update video: ${updateError.message}`);
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
