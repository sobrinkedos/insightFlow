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
    // 3. Analyze with GPT to detect tutorials and generate step-by-step
    
    // Simulating a delay for processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate tutorial detection
    const isTutorial = Math.random() > 0.5; // 50% chance for demo
    
    const simulated = {
      title: faker.hacker.phrase().replace(/^./, (c) => c.toUpperCase()),
      transcription: faker.lorem.paragraphs(3),
      summary_short: faker.lorem.sentence(),
      summary_expanded: faker.lorem.paragraph(),
      keywords: [faker.hacker.noun(), faker.hacker.noun(), faker.hacker.noun()],
      topics: [faker.hacker.verb(), faker.hacker.adjective()],
      category: faker.commerce.department(),
      is_tutorial: isTutorial,
      tutorial_steps: isTutorial ? generateTutorialSteps() : null,
    };
    
    function generateTutorialSteps() {
      return `# Passo a Passo

## 1. Preparação Inicial
Configure seu ambiente de desenvolvimento instalando as ferramentas necessárias.

## 2. Instalação de Dependências
Execute o comando de instalação para baixar todos os pacotes necessários.

## 3. Configuração
Configure as variáveis de ambiente e arquivos de configuração.

## 4. Implementação
Implemente a funcionalidade principal seguindo as boas práticas.

## 5. Testes
Execute os testes para garantir que tudo está funcionando corretamente.

## 6. Deploy
Faça o deploy da aplicação para produção.`;
    }
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
        summary_short: simulated.summary_short,
        summary_expanded: simulated.summary_expanded,
        topics: simulated.topics,
        keywords: simulated.keywords,
        category: simulated.category,
        is_tutorial: simulated.is_tutorial,
        tutorial_steps: simulated.tutorial_steps,
        theme_id: themeId,
        processed_at: new Date().toISOString(),
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
