import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const envVars = {
      OPENAI_API_KEY: Deno.env.get("OPENAI_API_KEY") ? "✅ Configured" : "❌ Missing",
      YOUTUBE_API_KEY: Deno.env.get("YOUTUBE_API_KEY") ? "✅ Configured" : "❌ Missing",
      RAPIDAPI_KEY: Deno.env.get("RAPIDAPI_KEY") ? "✅ Configured" : "❌ Missing",
      SUPABASE_URL: Deno.env.get("SUPABASE_URL") ? "✅ Configured" : "❌ Missing",
      SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ? "✅ Configured" : "❌ Missing",
    };

    console.log("Environment variables check:", envVars);

    return new Response(JSON.stringify(envVars, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
