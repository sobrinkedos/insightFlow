import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log("⏰ Cron: Checking queue for pending videos...");

    // Check if there are pending videos
    const { data: pendingVideos, error } = await supabaseAdmin
      .from("video_queue")
      .select("id, platform, video_id")
      .eq("status", "pending")
      .limit(10);

    if (error) {
      console.error("❌ Error checking pending videos:", error);
      throw error;
    }

    if (!pendingVideos || pendingVideos.length === 0) {
      console.log("📭 No pending videos in queue");
      return new Response(
        JSON.stringify({ 
          message: "No pending videos",
          checked_at: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    console.log(`📬 Found ${pendingVideos.length} pending videos, triggering processor...`);

    // Trigger the main queue processor
    const { data: invokeData, error: invokeError } = await supabaseAdmin.functions.invoke('process-video-queue', {
      body: {},
    });

    if (invokeError) {
      console.error("❌ Error invoking queue processor:", invokeError);
      throw invokeError;
    }

    console.log("✅ Queue processor triggered successfully");

    return new Response(
      JSON.stringify({ 
        message: "Queue processor triggered",
        pending_count: pendingVideos.length,
        triggered_at: new Date().toISOString(),
        result: invokeData
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error: any) {
    console.error("❌ Error in cron job:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
