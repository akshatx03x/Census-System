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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blockchain_logs: {
        Row: {
          created_at: string
          id: string
          state: string
          submission_id: string
          timestamp: string
          transaction_hash: string
          verification_status: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          state: string
          submission_id: string
          timestamp?: string
          transaction_hash: string
          verification_status?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          state?: string
          submission_id?: string
          timestamp?: string
          transaction_hash?: string
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blockchain_logs_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "census_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      census_submissions: {
        Row: {
          age: number
          blockchain_hash: string | null
          caste_category: Database["public"]["Enums"]["caste_category"]
          created_at: string
          district: string
          education_level: Database["public"]["Enums"]["education_level"]
          gender: string
          id: string
          income_range: Database["public"]["Enums"]["income_range"]
          name: string
          occupation: string
          state: string
          sub_caste: string | null
          submitted_at: string
          user_id: string
        }
        Insert: {
          age: number
          blockchain_hash?: string | null
          caste_category: Database["public"]["Enums"]["caste_category"]
          created_at?: string
          district: string
          education_level: Database["public"]["Enums"]["education_level"]
          gender: string
          id?: string
          income_range: Database["public"]["Enums"]["income_range"]
          name: string
          occupation: string
          state: string
          sub_caste?: string | null
          submitted_at?: string
          user_id: string
        }
        Update: {
          age?: number
          blockchain_hash?: string | null
          caste_category?: Database["public"]["Enums"]["caste_category"]
          created_at?: string
          district?: string
          education_level?: Database["public"]["Enums"]["education_level"]
          gender?: string
          id?: string
          income_range?: Database["public"]["Enums"]["income_range"]
          name?: string
          occupation?: string
          state?: string
          sub_caste?: string | null
          submitted_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          is_verified: boolean | null
          mobile_number: string | null
          pan_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_verified?: boolean | null
          mobile_number?: string | null
          pan_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_verified?: boolean | null
          mobile_number?: string | null
          pan_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_blockchain_hash: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "citizen"
      caste_category: "SC" | "ST" | "OBC" | "General" | "Other"
      education_level:
        | "No formal education"
        | "Primary (1-5)"
        | "Middle (6-8)"
        | "Secondary (9-10)"
        | "Higher Secondary (11-12)"
        | "Graduate"
        | "Post Graduate"
        | "Doctorate"
      income_range:
        | "Below 1 Lakh"
        | "1-3 Lakhs"
        | "3-5 Lakhs"
        | "5-10 Lakhs"
        | "10-25 Lakhs"
        | "Above 25 Lakhs"
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
      app_role: ["admin", "citizen"],
      caste_category: ["SC", "ST", "OBC", "General", "Other"],
      education_level: [
        "No formal education",
        "Primary (1-5)",
        "Middle (6-8)",
        "Secondary (9-10)",
        "Higher Secondary (11-12)",
        "Graduate",
        "Post Graduate",
        "Doctorate",
      ],
      income_range: [
        "Below 1 Lakh",
        "1-3 Lakhs",
        "3-5 Lakhs",
        "5-10 Lakhs",
        "10-25 Lakhs",
        "Above 25 Lakhs",
      ],
    },
  },
} as const
