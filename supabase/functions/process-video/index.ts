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

    // Extract video title from URL for better simulation
    const videoTitle = extractVideoTitle(video.url);
    
    // Detect if it's a tutorial/recipe based on URL or title
    const isTutorial = detectTutorial(videoTitle);
    const isRecipe = detectRecipe(videoTitle);
    
    const simulated = {
      title: videoTitle || faker.hacker.phrase().replace(/^./, (c) => c.toUpperCase()),
      transcription: faker.lorem.paragraphs(3),
      summary_short: faker.lorem.sentence(),
      summary_expanded: faker.lorem.paragraph(),
      keywords: isRecipe 
        ? ['receita', 'culinária', 'gastronomia', faker.food.dish()]
        : [faker.hacker.noun(), faker.hacker.noun(), faker.hacker.noun()],
      topics: isRecipe 
        ? ['Culinária', 'Receitas']
        : [faker.hacker.verb(), faker.hacker.adjective()],
      category: isRecipe ? 'Culinária' : faker.commerce.department(),
      subcategory: isRecipe ? 'Receitas' : null,
      is_tutorial: isTutorial || isRecipe,
      tutorial_steps: (isTutorial || isRecipe) ? generateTutorialSteps(isRecipe, videoTitle) : null,
    };
    
    function extractVideoTitle(url: string): string {
      try {
        const urlObj = new URL(url);
        // Try to get title from URL parameters or path
        const title = urlObj.searchParams.get('title') || 
                     urlObj.pathname.split('/').pop() || 
                     '';
        return decodeURIComponent(title).replace(/[-_]/g, ' ');
      } catch {
        return '';
      }
    }
    
    function detectTutorial(title: string): boolean {
      const tutorialKeywords = [
        'como fazer', 'tutorial', 'passo a passo', 'aprenda',
        'guia', 'instruções', 'configurar', 'instalar', 'criar'
      ];
      const lowerTitle = title.toLowerCase();
      return tutorialKeywords.some(keyword => lowerTitle.includes(keyword));
    }
    
    function detectRecipe(title: string): boolean {
      const recipeKeywords = [
        'receita', 'paella', 'cozinhar', 'preparar', 'prato',
        'comida', 'culinária', 'chef', 'gastronomia', 'ingredientes',
        'modo de preparo', 'temperar', 'assar', 'fritar'
      ];
      const lowerTitle = title.toLowerCase();
      return recipeKeywords.some(keyword => lowerTitle.includes(keyword));
    }
    
    function generateTutorialSteps(isRecipe: boolean, title: string): string {
      if (isRecipe) {
        return `# Ingredientes

- 400g de arroz para paella (ou arroz arbóreo)
- 500g de frutos do mar variados (camarão, lula, mexilhões)
- 300g de frango em cubos
- 1 cebola média picada
- 3 dentes de alho picados
- 2 tomates maduros picados
- 1 pimentão vermelho em tiras
- 100g de ervilhas frescas ou congeladas
- Açafrão ou colorau a gosto
- 1 litro de caldo de peixe ou frango
- Azeite de oliva
- Sal e pimenta a gosto
- Limão para servir

# Modo de Preparo

## 1. Preparação dos Ingredientes
Separe e prepare todos os ingredientes: pique a cebola, o alho, os tomates e corte o pimentão em tiras. Limpe os frutos do mar e tempere o frango com sal e pimenta.

## 2. Refogue a Base
Em uma paellera ou frigideira grande, aqueça o azeite e refogue a cebola e o alho até ficarem dourados. Adicione o frango e deixe dourar por todos os lados.

## 3. Adicione os Vegetais
Acrescente os tomates picados, o pimentão e as ervilhas. Refogue por 3-4 minutos até os tomates começarem a desmanchar.

## 4. Tempere e Adicione o Arroz
Adicione o açafrão ou colorau, misture bem. Acrescente o arroz e mexa para envolver todos os grãos no tempero, deixando tostar levemente por 2 minutos.

## 5. Adicione o Caldo
Despeje o caldo quente sobre o arroz. Não mexa mais! Deixe cozinhar em fogo médio-alto por 10 minutos sem mexer.

## 6. Adicione os Frutos do Mar
Distribua os frutos do mar sobre o arroz, pressionando levemente. Reduza o fogo e cozinhe por mais 10-15 minutos até o arroz absorver todo o líquido.

## 7. Finalize
Desligue o fogo e deixe descansar por 5 minutos coberto com um pano. Sirva com rodelas de limão.

# Dicas

- O segredo da paella é NÃO mexer o arroz após adicionar o caldo
- O fundo deve ficar levemente tostado (socarrat) - isso é desejável!
- Use uma paellera larga para o arroz cozinhar uniformemente
- Ajuste o sal no final, pois o caldo já tem sal`;
      } else {
        return `# Requisitos

- Conhecimento básico de programação
- Editor de código instalado
- Acesso à internet
- Terminal/linha de comando

# Passo a Passo

## 1. Preparação Inicial
Configure seu ambiente de desenvolvimento instalando as ferramentas necessárias. Verifique se todas as dependências estão disponíveis.

## 2. Instalação de Dependências
Execute o comando de instalação para baixar todos os pacotes necessários. Aguarde a conclusão do processo.

## 3. Configuração
Configure as variáveis de ambiente e arquivos de configuração. Certifique-se de que todas as credenciais estão corretas.

## 4. Implementação
Implemente a funcionalidade principal seguindo as boas práticas. Mantenha o código limpo e bem documentado.

## 5. Testes
Execute os testes para garantir que tudo está funcionando corretamente. Corrija eventuais erros encontrados.

## 6. Deploy
Faça o deploy da aplicação para produção. Monitore os logs para garantir que está tudo funcionando.`;
      }
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
