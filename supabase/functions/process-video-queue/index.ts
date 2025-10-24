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

    console.log("🔄 Starting queue processor...");

    // 1. Check if there's already a video being processed
    const { data: processingVideos, error: checkError } = await supabaseAdmin
      .from("video_queue")
      .select("id, video_id")
      .eq("status", "processing")
      .limit(1);

    if (checkError) {
      console.error("Error checking processing videos:", checkError);
      throw checkError;
    }

    if (processingVideos && processingVideos.length > 0) {
      console.log("⏸️ A video is already being processed, skipping...");
      return new Response(
        JSON.stringify({ 
          message: "A video is already being processed",
          processing_video_id: processingVideos[0].video_id
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // 2. Get the next video from the queue (highest priority, oldest first)
    const { data: nextInQueue, error: queueError } = await supabaseAdmin
      .from("video_queue")
      .select("id, video_id, user_id, attempts, max_attempts")
      .eq("status", "pending")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(1)
      .single();

    if (queueError || !nextInQueue) {
      console.log("📭 Queue is empty");
      return new Response(
        JSON.stringify({ message: "Queue is empty" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    console.log(`🎬 Processing video from queue: ${nextInQueue.video_id}`);

    // 3. Mark as processing
    const { error: updateError } = await supabaseAdmin
      .from("video_queue")
      .update({
        status: "processing",
        started_at: new Date().toISOString(),
        attempts: nextInQueue.attempts + 1,
      })
      .eq("id", nextInQueue.id);

    if (updateError) {
      console.error("Error updating queue status:", updateError);
      throw updateError;
    }

    // 4. Invoke the process-video function
    try {
      console.log(`📡 Invoking process-video for video_id: ${nextInQueue.video_id}`);
      
      const { error: functionError } = await supabaseAdmin.functions.invoke('process-video', {
        body: { video_id: nextInQueue.video_id },
      });

      if (functionError) {
        console.error("❌ Error processing video:", functionError);
        
        // Check if we should retry
        if (nextInQueue.attempts + 1 < nextInQueue.max_attempts) {
          // Reset to pending for retry
          await supabaseAdmin
            .from("video_queue")
            .update({
              status: "pending",
              error_message: functionError.message,
            })
            .eq("id", nextInQueue.id);
          
          console.log(`🔄 Video will be retried (attempt ${nextInQueue.attempts + 1}/${nextInQueue.max_attempts})`);
        } else {
          // Mark as failed
          await supabaseAdmin
            .from("video_queue")
            .update({
              status: "failed",
              completed_at: new Date().toISOString(),
              error_message: functionError.message,
            })
            .eq("id", nextInQueue.id);
          
          // Also mark video as failed
          await supabaseAdmin
            .from("videos")
            .update({ status: "Falha" })
            .eq("id", nextInQueue.video_id);
          
          console.log(`❌ Video processing failed after ${nextInQueue.max_attempts} attempts`);
        }
        
        throw functionError;
      }

      // 5. Mark as completed
      await supabaseAdmin
        .from("video_queue")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", nextInQueue.id);

      console.log(`✅ Video processed successfully: ${nextInQueue.video_id}`);

      // 6. Check if there are more videos in the queue and trigger next processing
      const { data: remainingQueue } = await supabaseAdmin
        .from("video_queue")
        .select("id")
        .eq("status", "pending")
        .limit(1);

      if (remainingQueue && remainingQueue.length > 0) {
        console.log("📬 More videos in queue, triggering next processing...");
        
        // Trigger next processing asynchronously (don't await)
        supabaseAdmin.functions.invoke('process-video-queue', {
          body: {},
        }).catch(err => console.error("Error triggering next queue processing:", err));
      }

      return new Response(
        JSON.stringify({ 
          message: "Video processed successfully",
          video_id: nextInQueue.video_id,
          has_more: remainingQueue && remainingQueue.length > 0
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );

    } catch (error) {
      console.error("Error in video processing:", error);
      throw error;
    }

  } catch (error) {
    console.error("Error in queue processor:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
