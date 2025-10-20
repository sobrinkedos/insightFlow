// Instagram API integration using RapidAPI
// Docs: https://rapidapi.com/maatootz/api/instagram120

interface InstagramPost {
  id: string;
  caption?: string;
  media_type: string;
  media_url?: string;
  video_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  username?: string;
  like_count?: number;
  comments_count?: number;
}

interface InstagramApiResponse {
  data?: {
    items?: any[];
    user?: any;
  };
  status?: string;
  message?: string;
}

export class InstagramAPI {
  private apiKey: string;
  private apiHost: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = Deno.env.get("RAPIDAPI_KEY") || "";
    this.apiHost = Deno.env.get("RAPIDAPI_HOST") || "instagram120.p.rapidapi.com";
    this.baseUrl = `https://${this.apiHost}`;

    // Don't throw error on initialization, check when methods are called
    if (!this.apiKey) {
      console.warn("RAPIDAPI_KEY not configured - Instagram API will use fallback");
    }
  }

  /**
   * Extract username and post ID from Instagram URL
   */
  private parseInstagramUrl(url: string): { username?: string; postId?: string } | null {
    try {
      const urlObj = new URL(url);
      
      // Format: instagram.com/p/POST_ID or instagram.com/reel/POST_ID
      const postMatch = urlObj.pathname.match(/\/(p|reel|tv)\/([^\/\?]+)/);
      if (postMatch) {
        return { postId: postMatch[2] };
      }

      // Format: instagram.com/USERNAME
      const usernameMatch = urlObj.pathname.match(/^\/([^\/\?]+)\/?$/);
      if (usernameMatch && usernameMatch[1] !== 'p' && usernameMatch[1] !== 'reel') {
        return { username: usernameMatch[1] };
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Get posts from a user
   */
  async getUserPosts(username: string, maxId: string = ""): Promise<InstagramApiResponse> {
    if (!this.apiKey) {
      throw new Error("RAPIDAPI_KEY not configured");
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/instagram/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": this.apiHost,
          "x-rapidapi-key": this.apiKey,
        },
        body: JSON.stringify({
          username,
          maxId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Instagram API error:", errorText);
        throw new Error(`Instagram API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching Instagram posts:", error);
      throw error;
    }
  }

  /**
   * Get post info by URL
   */
  async getPostInfo(url: string): Promise<{ title: string; description: string; videoUrl?: string } | null> {
    try {
      const parsed = this.parseInstagramUrl(url);
      
      if (!parsed || !parsed.postId) {
        console.warn("Could not parse Instagram URL:", url);
        return null;
      }

      // Try to get post info using shortcode
      // Note: The API might need the username, so we'll try a fallback approach
      
      // Fallback: Use oEmbed API (public, no auth needed)
      try {
        const oembedUrl = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(url)}`;
        const oembedResponse = await fetch(oembedUrl);
        
        if (oembedResponse.ok) {
          const oembedData = await oembedResponse.json();
          console.log("Instagram oEmbed data:", oembedData);
          
          return {
            title: oembedData.title || `Post do Instagram`,
            description: oembedData.title || `Conteúdo compartilhado no Instagram. ${oembedData.author_name ? `Por: ${oembedData.author_name}` : ''}`,
            videoUrl: undefined, // oEmbed doesn't provide direct video URL
          };
        }
      } catch (oembedError) {
        console.warn("oEmbed fallback failed:", oembedError);
      }

      // If all else fails, return generic info
      return {
        title: `Post do Instagram`,
        description: `Conteúdo do Instagram (ID: ${parsed.postId}). Para análise detalhada, configure as credenciais da API.`,
      };
    } catch (error) {
      console.error("Error getting Instagram post info:", error);
      return null;
    }
  }

  /**
   * Search for a specific post by trying to get user posts
   * This is a workaround since we might not have direct post access
   */
  async findPostByShortcode(username: string, shortcode: string): Promise<any | null> {
    try {
      const postsResponse = await this.getUserPosts(username);
      
      if (postsResponse.data?.items) {
        // Try to find the post with matching shortcode
        const post = postsResponse.data.items.find((item: any) => 
          item.code === shortcode || item.id === shortcode
        );
        
        return post || null;
      }

      return null;
    } catch (error) {
      console.error("Error finding post by shortcode:", error);
      return null;
    }
  }
}

// Export a singleton instance
export const instagramAPI = new InstagramAPI();
