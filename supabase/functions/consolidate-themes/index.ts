import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Buscar todos os temas
    const { data: themes, error: themesError } = await supabaseAdmin
      .from("themes")
      .select("*");

    if (themesError) {
      throw new Error(`Erro ao buscar temas: ${themesError.message}`);
    }

    let updatedCount = 0;

    // Melhorar títulos dos temas
    for (const theme of themes || []) {
      let newTitle = theme.title;

      // Remover "Tema sobre" do início
      if (newTitle.startsWith("Tema sobre ")) {
        newTitle = newTitle.replace("Tema sobre ", "");
        
        // Capitalizar primeira letra
        newTitle = newTitle.charAt(0).toUpperCase() + newTitle.slice(1);

        // Atualizar no banco
        const { error: updateError } = await supabaseAdmin
          .from("themes")
          .update({ title: newTitle })
          .eq("id", theme.id);

        if (!updateError) {
          updatedCount++;
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `${updatedCount} temas atualizados com sucesso`,
        total: themes?.length || 0,
        updated: updatedCount
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erro ao consolidar temas:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
