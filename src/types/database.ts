export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          created_at: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          created_at?: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          created_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "themes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      video_progress: {
        Row: {
          id: string
          user_id: string
          video_id: string
          watched_time: number
          duration: number | null
          progress_percentage: number | null
          completed: boolean
          last_watched_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          video_id: string
          watched_time?: number
          duration?: number | null
          completed?: boolean
          last_watched_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          video_id?: string
          watched_time?: number
          duration?: number | null
          completed?: boolean
          last_watched_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_progress_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          status: string
          theme_id: string | null
          title: string | null
          channel: string | null
          transcription: string | null
          summary_short: string | null
          summary_expanded: string | null
          topics: string[] | null
          keywords: string[] | null
          category: string | null
          subcategory: string | null
          processed_at: string | null
          url: string
          user_id: string
          is_favorite: boolean
          is_tutorial: boolean
          tutorial_steps: string | null
          video_url: string | null
          thumbnail_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          status?: string
          theme_id?: string | null
          title?: string | null
          channel?: string | null
          transcription?: string | null
          summary_short?: string | null
          summary_expanded?: string | null
          topics?: string[] | null
          keywords?: string[] | null
          category?: string | null
          subcategory?: string | null
          processed_at?: string | null
          url: string
          user_id: string
          is_favorite?: boolean
          is_tutorial?: boolean
          tutorial_steps?: string | null
          video_url?: string | null
          thumbnail_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          status?: string
          theme_id?: string | null
          title?: string | null
          channel?: string | null
          transcription?: string | null
          summary_short?: string | null
          summary_expanded?: string | null
          topics?: string[] | null
          keywords?: string[] | null
          category?: string | null
          subcategory?: string | null
          processed_at?: string | null
          url?: string
          user_id?: string
          is_favorite?: boolean
          is_tutorial?: boolean
          tutorial_steps?: string | null
          video_url?: string | null
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "themes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "videos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_new_user: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Theme = Database['public']['Tables']['themes']['Row'] & { video_count: number };
export type Video = Database['public']['Tables']['videos']['Row'];
export type VideoProgress = Database['public']['Tables']['video_progress']['Row'];
