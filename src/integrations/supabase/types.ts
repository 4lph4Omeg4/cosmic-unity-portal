export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ai_datasets: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          metadata: Json
          name: string
          org_id: string
          tags: string[]
          version: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json
          name: string
          org_id: string
          tags?: string[]
          version?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json
          name?: string
          org_id?: string
          tags?: string[]
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_datasets_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_dialog_messages: {
        Row: {
          content: string
          example_id: string
          id: string
          metadata: Json
          msg_index: number
          role: string
        }
        Insert: {
          content: string
          example_id: string
          id?: string
          metadata?: Json
          msg_index: number
          role: string
        }
        Update: {
          content?: string
          example_id?: string
          id?: string
          metadata?: Json
          msg_index?: number
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_dialog_messages_example_id_fkey"
            columns: ["example_id"]
            isOneToOne: false
            referencedRelation: "ai_dialogs_jsonl"
            referencedColumns: ["example_id"]
          },
          {
            foreignKeyName: "ai_dialog_messages_example_id_fkey"
            columns: ["example_id"]
            isOneToOne: false
            referencedRelation: "ai_examples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_dialog_messages_example_id_fkey"
            columns: ["example_id"]
            isOneToOne: false
            referencedRelation: "ai_examples_jsonl"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_documents: {
        Row: {
          content: string
          created_at: string
          dataset_id: string
          id: string
          metadata: Json
          path: string
        }
        Insert: {
          content: string
          created_at?: string
          dataset_id: string
          id?: string
          metadata?: Json
          path: string
        }
        Update: {
          content?: string
          created_at?: string
          dataset_id?: string
          id?: string
          metadata?: Json
          path?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_documents_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "ai_datasets"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_examples: {
        Row: {
          created_at: string
          dataset_id: string
          id: string
          input: Json | null
          kind: Database["public"]["Enums"]["example_kind"]
          metadata: Json
          output: string | null
        }
        Insert: {
          created_at?: string
          dataset_id: string
          id?: string
          input?: Json | null
          kind: Database["public"]["Enums"]["example_kind"]
          metadata?: Json
          output?: string | null
        }
        Update: {
          created_at?: string
          dataset_id?: string
          id?: string
          input?: Json | null
          kind?: Database["public"]["Enums"]["example_kind"]
          metadata?: Json
          output?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_examples_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "ai_datasets"
            referencedColumns: ["id"]
          },
        ]
      }
      approvals: {
        Row: {
          created_at: string
          id: string
          note: string | null
          post_id: string
          requested_by: string | null
          state: Database["public"]["Enums"]["approval_state"]
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          post_id: string
          requested_by?: string | null
          state?: Database["public"]["Enums"]["approval_state"]
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          post_id?: string
          requested_by?: string | null
          state?: Database["public"]["Enums"]["approval_state"]
        }
        Relationships: [
          {
            foreignKeyName: "approvals_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      client_users: {
        Row: {
          client_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_users_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          email: string | null
          id: string
          metadata: Json | null
          name: string
          org_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          metadata?: Json | null
          name: string
          org_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      content_staging: {
        Row: {
          body: string
          client_id: string | null
          created_at: string
          created_by: string | null
          format: Database["public"]["Enums"]["content_format"]
          id: string
          media_refs: Json
          metadata: Json
          org_id: string
          source_agent: Database["public"]["Enums"]["agent_kind"]
          source_title: string | null
          source_url: string | null
          status: Database["public"]["Enums"]["staging_status"]
          tags: string[]
          trend: string | null
          updated_at: string
        }
        Insert: {
          body: string
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          format: Database["public"]["Enums"]["content_format"]
          id?: string
          media_refs?: Json
          metadata?: Json
          org_id: string
          source_agent: Database["public"]["Enums"]["agent_kind"]
          source_title?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["staging_status"]
          tags?: string[]
          trend?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          format?: Database["public"]["Enums"]["content_format"]
          id?: string
          media_refs?: Json
          metadata?: Json
          org_id?: string
          source_agent?: Database["public"]["Enums"]["agent_kind"]
          source_title?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["staging_status"]
          tags?: string[]
          trend?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_staging_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_staging_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_outbox: {
        Row: {
          created_at: string
          delivered: boolean
          id: string
          kind: string
          payload: Json
        }
        Insert: {
          created_at?: string
          delivered?: boolean
          id?: string
          kind: string
          payload: Json
        }
        Update: {
          created_at?: string
          delivered?: boolean
          id?: string
          kind?: string
          payload?: Json
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          created_at: string | null
          entry_text: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          entry_text?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          entry_text?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          read: boolean
          receiver_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          read?: boolean
          receiver_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          read?: boolean
          receiver_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      org_members: {
        Row: {
          created_at: string
          org_id: string
          role: Database["public"]["Enums"]["role_kind"]
          user_id: string
        }
        Insert: {
          created_at?: string
          org_id: string
          role: Database["public"]["Enums"]["role_kind"]
          user_id: string
        }
        Update: {
          created_at?: string
          org_id?: string
          role?: Database["public"]["Enums"]["role_kind"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          name?: string
        }
        Relationships: []
      }
      post_variants: {
        Row: {
          body: string
          created_at: string
          id: string
          metadata: Json | null
          platform: Database["public"]["Enums"]["platform_kind"]
          post_id: string
          publish_status: Database["public"]["Enums"]["variant_status"]
          scheduled_at: string | null
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          metadata?: Json | null
          platform: Database["public"]["Enums"]["platform_kind"]
          post_id: string
          publish_status?: Database["public"]["Enums"]["variant_status"]
          scheduled_at?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          platform?: Database["public"]["Enums"]["platform_kind"]
          post_id?: string
          publish_status?: Database["public"]["Enums"]["variant_status"]
          scheduled_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_variants_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string | null
          brief: string | null
          client_id: string | null
          content: string
          created_at: string
          fts: unknown | null
          id: string
          image_url: string | null
          org_id: string | null
          published_at: string | null
          status: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author_id?: string | null
          brief?: string | null
          client_id?: string | null
          content: string
          created_at?: string
          fts?: unknown | null
          id?: string
          image_url?: string | null
          org_id?: string | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author_id?: string | null
          brief?: string | null
          client_id?: string | null
          content?: string
          created_at?: string
          fts?: unknown | null
          id?: string
          image_url?: string | null
          org_id?: string | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          social_links: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          social_links?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          social_links?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      publish_log: {
        Row: {
          created_at: string
          id: string
          metrics: Json | null
          post_variant_id: string
          provider: Database["public"]["Enums"]["platform_kind"]
          provider_response: Json | null
          result: string
        }
        Insert: {
          created_at?: string
          id?: string
          metrics?: Json | null
          post_variant_id: string
          provider: Database["public"]["Enums"]["platform_kind"]
          provider_response?: Json | null
          result: string
        }
        Update: {
          created_at?: string
          id?: string
          metrics?: Json | null
          post_variant_id?: string
          provider?: Database["public"]["Enums"]["platform_kind"]
          provider_response?: Json | null
          result?: string
        }
        Relationships: [
          {
            foreignKeyName: "publish_log_post_variant_id_fkey"
            columns: ["post_variant_id"]
            isOneToOne: false
            referencedRelation: "post_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      social_accounts: {
        Row: {
          client_id: string | null
          connector: Json | null
          created_at: string
          display_name: string | null
          id: string
          provider: Database["public"]["Enums"]["platform_kind"]
          secrets: Json | null
        }
        Insert: {
          client_id?: string | null
          connector?: Json | null
          created_at?: string
          display_name?: string | null
          id?: string
          provider: Database["public"]["Enums"]["platform_kind"]
          secrets?: Json | null
        }
        Update: {
          client_id?: string | null
          connector?: Json | null
          created_at?: string
          display_name?: string | null
          id?: string
          provider?: Database["public"]["Enums"]["platform_kind"]
          secrets?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "social_accounts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          progress_data: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          progress_data?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          progress_data?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      _org_membership_txt: {
        Row: {
          org_id_txt: string | null
          user_id_txt: string | null
        }
        Relationships: []
      }
      ai_dialogs_jsonl: {
        Row: {
          dataset_id: string | null
          example_id: string | null
          jsonl: Json | null
        }
        Insert: {
          dataset_id?: string | null
          example_id?: string | null
          jsonl?: never
        }
        Update: {
          dataset_id?: string | null
          example_id?: string | null
          jsonl?: never
        }
        Relationships: [
          {
            foreignKeyName: "ai_examples_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "ai_datasets"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_examples_jsonl: {
        Row: {
          dataset_id: string | null
          id: string | null
          jsonl: Json | null
          kind: Database["public"]["Enums"]["example_kind"] | null
        }
        Insert: {
          dataset_id?: string | null
          id?: string | null
          jsonl?: never
          kind?: Database["public"]["Enums"]["example_kind"] | null
        }
        Update: {
          dataset_id?: string | null
          id?: string | null
          jsonl?: never
          kind?: Database["public"]["Enums"]["example_kind"] | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_examples_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "ai_datasets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      _to_platform: {
        Args: { p: string }
        Returns: Database["public"]["Enums"]["platform_kind"]
      }
      algorithm_sign: {
        Args: { algorithm: string; secret: string; signables: string }
        Returns: string
      }
      can_access_client: {
        Args: { p_client: string }
        Returns: boolean
      }
      client_org: {
        Args: { p_client: string }
        Returns: string
      }
      dataset_org: {
        Args: { p_dataset: string }
        Returns: string
      }
      example_org: {
        Args: { p_example: string }
        Returns: string
      }
      get_latest_grok_output: {
        Args: { p_client_id?: string; p_limit?: number; p_org_id: string }
        Returns: {
          body: string
          client_id: string
          created_at: string
          created_by: string
          format: string
          id: string
          media_refs: Json
          metadata: Json
          org_id: string
          source_agent: string
          source_title: string
          source_url: string
          status: string
          tags: string[]
          trend: string
          updated_at: string
        }[]
      }
      ingest_grok_staging: {
        Args: {
          p_client?: string
          p_org: string
          p_payload: Json
          p_status?: Database["public"]["Enums"]["staging_status"]
          p_user: string
        }
        Returns: number
      }
      ingest_manus_staging: {
        Args: {
          p_client?: string
          p_org: string
          p_payload: Json
          p_status?: Database["public"]["Enums"]["staging_status"]
          p_user: string
        }
        Returns: number
      }
      ingest_unified_staging: {
        Args: {
          p_client?: string
          p_org: string
          p_payload: Json
          p_user: string
        }
        Returns: number
      }
      is_org_member: {
        Args: {
          allowed_roles?: Database["public"]["Enums"]["role_kind"][]
          p_org: string
        }
        Returns: boolean
      }
      promote_staging_to_post: {
        Args: {
          p_mark_status?: Database["public"]["Enums"]["staging_status"]
          p_platform_text?: string
          p_post_status?: Database["public"]["Enums"]["post_status"]
          p_staging_id: string
          p_user: string
        }
        Returns: {
          post_id: string
          variant_id: string
        }[]
      }
      set_post_status: {
        Args: {
          p_post: string
          p_status: Database["public"]["Enums"]["post_status"]
        }
        Returns: undefined
      }
      sign: {
        Args: { algorithm?: string; payload: Json; secret: string }
        Returns: string
      }
      try_cast_double: {
        Args: { inp: string }
        Returns: number
      }
      url_decode: {
        Args: { data: string }
        Returns: string
      }
      url_encode: {
        Args: { data: string }
        Returns: string
      }
      verify: {
        Args: { algorithm?: string; secret: string; token: string }
        Returns: {
          header: Json
          payload: Json
          valid: boolean
        }[]
      }
    }
    Enums: {
      agent_kind: "grok" | "manus" | "human" | "other"
      approval_state:
        | "awaiting_client"
        | "approved"
        | "changes_requested"
        | "rejected"
      content_format:
        | "idea"
        | "outline"
        | "caption"
        | "thread"
        | "blog_draft"
        | "hook"
        | "script"
        | "image_prompt"
        | "newsletter"
        | "short_form"
      example_kind: "instructions" | "qa" | "dialog" | "eval" | "redteam"
      platform_kind: "facebook" | "instagram" | "linkedin" | "tiktok" | "x"
      post_status:
        | "draft"
        | "submitted"
        | "approved"
        | "changes_requested"
        | "scheduled"
        | "published"
        | "canceled"
      role_kind: "owner" | "editor" | "client"
      staging_status: "pending" | "selected" | "discarded" | "published"
      variant_status: "pending" | "queued" | "sent" | "failed" | "published"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agent_kind: ["grok", "manus", "human", "other"],
      approval_state: [
        "awaiting_client",
        "approved",
        "changes_requested",
        "rejected",
      ],
      content_format: [
        "idea",
        "outline",
        "caption",
        "thread",
        "blog_draft",
        "hook",
        "script",
        "image_prompt",
        "newsletter",
        "short_form",
      ],
      example_kind: ["instructions", "qa", "dialog", "eval", "redteam"],
      platform_kind: ["facebook", "instagram", "linkedin", "tiktok", "x"],
      post_status: [
        "draft",
        "submitted",
        "approved",
        "changes_requested",
        "scheduled",
        "published",
        "canceled",
      ],
      role_kind: ["owner", "editor", "client"],
      staging_status: ["pending", "selected", "discarded", "published"],
      variant_status: ["pending", "queued", "sent", "failed", "published"],
    },
  },
} as const
