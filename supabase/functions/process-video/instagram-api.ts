// Instagram API integration using RapidAPI
// API: Instagram Downloader (videos4)
// Docs: https://rapidapi.com/

export class InstagramAPI {
  private apiKey: string;
  private apiHost: string;

  constructor() {
    // Try to get from environment variable, fallback to hardcoded key
    this.apiKey = Deno.env.get("RAPIDAPI_KEY") || "5b4ef30d7amsh604c58627ce5d90p18121bjsnbc0f5b169f67";
    this.apiHost = "instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com";

    console.log("🔑 RAPIDAPI_KEY configured:", !!this.apiKey);
    console.log("🔑 RAPIDAPI_KEY length:", this.apiKey.length);
    console.log("🔑 RAPIDAPI_KEY first 20 chars:", this.apiKey.substring(0, 20));
    
    if (!this.apiKey) {
      console.warn("⚠️ RAPIDAPI_KEY not configured - Instagram API will use fallback");
    } else {
      console.log("✅ RAPIDAPI_KEY is available");
    }
  }

  /**
   * Get post info by URL using RapidAPI Instagram Downloader
   * This API returns: media array with type, url, thumbnail
   */
  async getPostInfo(url: string): Promise<{ title: string; description: string; videoUrl?: string; thumbnailUrl?: string } | null> {
    try {
      console.log("🔍 Fetching Instagram post info for:", url);

      let caption = "";
      let thumbnailUrl = "";
      let videoUrl = "";

      // Step 1: Try RapidAPI to get media URLs
      if (this.apiKey) {
        try {
          const apiUrl = `https://${this.apiHost}/convert?url=${encodeURIComponent(url)}`;
          console.log("📡 Trying RapidAPI Instagram Downloader (videos4)...");
          console.log("📡 API URL:", apiUrl);
          console.log("📡 API Host:", this.apiHost);
          console.log("📡 API Key length:", this.apiKey.length);
          
          const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
              "x-rapidapi-host": this.apiHost,
              "x-rapidapi-key": this.apiKey,
            },
          });

          console.log("📊 Response status:", response.status, response.statusText);
          
          if (response.ok) {
            const data = await response.json();
            console.log("✅ RapidAPI response:", JSON.stringify(data, null, 2));
            
            // Extract media URLs
            if (data.media && Array.isArray(data.media) && data.media.length > 0) {
              const firstMedia = data.media[0];
              
              if (firstMedia.type === "video") {
                videoUrl = firstMedia.url || "";
                thumbnailUrl = firstMedia.thumbnail || "";
                console.log("✅ Found video:", videoUrl.substring(0, 100));
              } else if (firstMedia.type === "image") {
                thumbnailUrl = firstMedia.url || firstMedia.thumbnail || "";
                console.log("✅ Found image:", thumbnailUrl.substring(0, 100));
              }
            }
          } else {
            const errorText = await response.text();
            console.warn("⚠️ RapidAPI returned non-OK status:", response.status, errorText);
          }
        } catch (apiError) {
          console.warn("❌ RapidAPI request failed:", apiError);
        }
      } else {
        console.warn("⚠️ RAPIDAPI_KEY not configured");
      }
      
      // Step 2: Try oEmbed API to get caption/title
      try {
        console.log("📡 Trying Instagram oEmbed API for caption...");
        const oembedUrl = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=`;
        const oembedResponse = await fetch(oembedUrl);
        
        if (oembedResponse.ok) {
          const oembedData = await oembedResponse.json();
          console.log("✅ Instagram oEmbed data:", oembedData);
          
          caption = oembedData.title || "";
          if (!thumbnailUrl && oembedData.thumbnail_url) {
            thumbnailUrl = oembedData.thumbnail_url;
          }
        }
      } catch (oembedError) {
        console.warn("⚠️ oEmbed request failed:", oembedError);
      }

      // Step 3: Return combined data
      if (videoUrl || thumbnailUrl || caption) {
        return {
          title: caption ? `Post do Instagram: ${caption.substring(0, 100)}${caption.length > 100 ? '...' : ''}` : "Post do Instagram",
          description: caption || `Vídeo do Instagram. Link: ${url}`,
          videoUrl: videoUrl || undefined,
          thumbnailUrl: thumbnailUrl || undefined,
        };
      }

      // Fallback: return generic info
      console.warn("⚠️ No data retrieved, returning generic info");
      return {
        title: `Vídeo do Instagram`,
        description: `Post do Instagram. Link: ${url}. Configure as APIs para obter mais informações.`,
        videoUrl: undefined,
        thumbnailUrl: undefined,
      };
    } catch (error) {
      console.error("❌ Error getting Instagram post info:", error);
      return null;
    }
  }
}

// Export a singleton instance
export const instagramAPI = new InstagramAPI();
