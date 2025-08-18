export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          metadata?: Json | null
          created_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          org_id: string
          name: string
          metadata: Json | null
          created_at: string
          contact_email: string | null
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          metadata?: Json | null
          created_at?: string
          contact_email?: string | null
        }
        Update: {
          id?: string
          org_id?: string
          name?: string
          metadata?: Json | null
          created_at?: string
          contact_email?: string | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          role: 'admin' | 'client' | 'reviewer'
          created_at: string
        }
        Insert: {
          id: string
          role: 'admin' | 'client' | 'reviewer'
          created_at?: string
        }
        Update: {
          id?: string
          role?: 'admin' | 'client' | 'reviewer'
          created_at?: string
        }
      }
      user_clients: {
        Row: {
          user_id: string
          client_id: string
        }
        Insert: {
          user_id: string
          client_id: string
        }
        Update: {
          user_id?: string
          client_id?: string
        }
      }
      ideas: {
        Row: {
          id: string
          title: string
          description: string | null
          status: 'draft' | 'approved' | 'rejected'
          created_at: string
          created_by: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: 'draft' | 'approved' | 'rejected'
          created_at?: string
          created_by: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: 'draft' | 'approved' | 'rejected'
          created_at?: string
          created_by?: string
          metadata?: Json | null
        }
      }
      previews: {
        Row: {
          id: string
          idea_id: string
          client_id: string
          channel: string
          template: string
          draft_content: Json
          scheduled_at: string | null
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          idea_id: string
          client_id: string
          channel: string
          template: string
          draft_content: Json
          scheduled_at?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          idea_id?: string
          client_id?: string
          channel?: string
          template?: string
          draft_content?: Json
          scheduled_at?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          created_by?: string
        }
      }
      publishes: {
        Row: {
          id: string
          preview_id: string
          published_at: string
          status: 'posted' | 'failed'
          result: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          preview_id: string
          published_at: string
          status: 'posted' | 'failed'
          result?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          preview_id?: string
          published_at?: string
          status?: 'posted' | 'failed'
          result?: Json | null
          created_at?: string
        }
      }
      social_tokens: {
        Row: {
          id: string
          user_id: string
          platform: string
          access_token: string
          refresh_token: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          access_token: string
          refresh_token?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: string
          access_token?: string
          refresh_token?: string | null
          expires_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      client_ids_for_user: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
