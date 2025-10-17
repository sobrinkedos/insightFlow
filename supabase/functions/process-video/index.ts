import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { faker } from "https://esm.sh/@faker-js/faker@v8.4.1";

// IMPORTANT: Set these secrets in your Supabase project dashboard:
// `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`
// Docs: https://supabase.com/docs/guides/functions/secrets

// Although the OpenAI key is set, this function currently SIMULATES AI processing.
// The actual API call logic is commented out as a reference for future implementation.
// const openAIKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    // --- AI PROCESSING SIMULATION ---
    // In a real scenario, you would:
    // 1. Download audio from video.url (e.g., using a YouTube downloader library)
    // 2. Transcribe audio using OpenAI Whisper API.
    // 3. Summarize transcription using OpenAI GPT API.
    // 4. Extract keywords and generate a title.
    
    // Simulating a delay for processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    const simulated = {
      title: faker.hacker.phrase().replace(/^./, (c) => c.toUpperCase()),
      transcription: faker.lorem.paragraphs(3),
      summary: faker.lorem.sentence(),
      keywords: [faker.hacker.noun(), faker.hacker.noun(), faker.hacker.noun()],
    };
    // --- END OF SIMULATION ---

    // 2. Find or create a theme
    const themeTitle = `Tema sobre ${faker.company.buzzNoun()}`;
    let themeId = null;

    // Check if a similar theme exists for the user
    const { data: existingTheme } = await supabaseAdmin
      .from("themes")
      .select("id")
      .eq("user_id", video.user_id)
      .ilike("title", `%${themeTitle.split(" ").pop()}%`) // Simple check
      .limit(1)
      .single();

    if (existingTheme) {
      themeId = existingTheme.id;
    } else {
      // Create a new theme
      const { data: newTheme, error: themeError } = await supabaseAdmin
        .from("themes")
        .insert({
          user_id: video.user_id,
          title: themeTitle,
          description: `Um tema consolidado sobre ${themeTitle.split(" ").pop()}.`,
        })
        .select("id")
        .single();

      if (themeError || !newTheme) {
        throw new Error(`Could not create theme: ${themeError?.message}`);
      }
      themeId = newTheme.id;
    }

    // 3. Update the video with processed data
    const { error: updateError } = await supabaseAdmin
      .from("videos")
      .update({
        status: "Processado",
        title: simulated.title,
        transcription: simulated.transcription,
        metadata: {
          summary: simulated.summary,
          keywords: simulated.keywords,
        },
        theme_id: themeId,
      })
      .eq("id", video_id);

    if (updateError) {
      throw new Error(`Failed to update video: ${updateError.message}`);
    }

    return new Response(JSON.stringify({ message: "Video processed successfully" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    // If processing fails, update video status to 'Falha'
    try {
      const { video_id } = await req.json();
      if (video_id) {
          const supabaseAdmin = createClient(
              Deno.env.get("SUPABASE_URL") ?? "",
              Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
          );
          await supabaseAdmin.from("videos").update({ status: "Falha" }).eq("id", video_id);
      }
    } catch (e) {
      // Ignore if parsing body fails in error handler
    }
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
