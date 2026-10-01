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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      enquiries: {
        Row: {
          archived: boolean
          created_at: string
          email: string
          full_name: string
          grade: string | null
          id: string
          message: string | null
          phone: string | null
          preferred_date: string | null
          programme: string | null
          staff_notes: string | null
          status: string
          subjects: string[]
        }
        Insert: {
          archived?: boolean
          created_at?: string
          email: string
          full_name: string
          grade?: string | null
          id?: string
          message?: string | null
          phone?: string | null
          preferred_date?: string | null
          programme?: string | null
          staff_notes?: string | null
          status?: string
          subjects?: string[]
        }
        Update: {
          archived?: boolean
          created_at?: string
          email?: string
          full_name?: string
          grade?: string | null
          id?: string
          message?: string | null
          phone?: string | null
          preferred_date?: string | null
          programme?: string | null
          staff_notes?: string | null
          status?: string
          subjects?: string[]
        }
        Relationships: []
      }
      fees: {
        Row: {
          active: boolean
          amount: number
          created_at: string
          created_by: string | null
          created_by_name: string
          currency: string
          description: string | null
          effective_from: string | null
          id: string
          name: string
          tax_included: boolean
          tax_rate_percent: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          amount: number
          created_at?: string
          created_by?: string | null
          created_by_name?: string
          currency?: string
          description?: string | null
          effective_from?: string | null
          id?: string
          name: string
          tax_included?: boolean
          tax_rate_percent?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          amount?: number
          created_at?: string
          created_by?: string | null
          created_by_name?: string
          currency?: string
          description?: string | null
          effective_from?: string | null
          id?: string
          name?: string
          tax_included?: boolean
          tax_rate_percent?: number
          updated_at?: string
        }
        Relationships: []
      }
      package_fees: {
        Row: {
          fee_id: string
          package_id: string
        }
        Insert: {
          fee_id: string
          package_id: string
        }
        Update: {
          fee_id?: string
          package_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_fees_fee_id_fkey"
            columns: ["fee_id"]
            isOneToOne: false
            referencedRelation: "fees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_fees_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          active: boolean
          created_at: string
          created_by: string | null
          created_by_name: string
          currency: string
          details: Json
          duration_days: number | null
          id: string
          name: string
          price: number
          tax_included: boolean
          tax_rate_percent: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          created_by_name?: string
          currency?: string
          details?: Json
          duration_days?: number | null
          id?: string
          name: string
          price: number
          tax_included?: boolean
          tax_rate_percent?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          created_by_name?: string
          currency?: string
          details?: Json
          duration_days?: number | null
          id?: string
          name?: string
          price?: number
          tax_included?: boolean
          tax_rate_percent?: number
          updated_at?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: string | null
          created_at: string
          id: string
          meta_description: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          meta_description?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          meta_description?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          agreed_terms: boolean
          attendance_mode: string | null
          created_at: string
          date_of_birth: string | null
          emergency_name: string | null
          emergency_phone: string | null
          emergency_relationship: string | null
          grade_level: string | null
          guardian1_address: string | null
          guardian1_email: string
          guardian1_id: string | null
          guardian1_name: string
          guardian1_phone: string
          guardian1_relationship: string | null
          guardian1_work_phone: string | null
          guardian2_address: string | null
          guardian2_email: string | null
          guardian2_id: string | null
          guardian2_name: string | null
          guardian2_phone: string | null
          guardian2_relationship: string | null
          guardian2_work_phone: string | null
          id: string
          id_number: string | null
          photo_consent: boolean
          special_needs: string | null
          staff_notes: string | null
          status: string
          student_email: string | null
          student_name: string
          student_phone: string | null
          subjects: string[]
        }
        Insert: {
          agreed_terms?: boolean
          attendance_mode?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_name?: string | null
          emergency_phone?: string | null
          emergency_relationship?: string | null
          grade_level?: string | null
          guardian1_address?: string | null
          guardian1_email: string
          guardian1_id?: string | null
          guardian1_name: string
          guardian1_phone: string
          guardian1_relationship?: string | null
          guardian1_work_phone?: string | null
          guardian2_address?: string | null
          guardian2_email?: string | null
          guardian2_id?: string | null
          guardian2_name?: string | null
          guardian2_phone?: string | null
          guardian2_relationship?: string | null
          guardian2_work_phone?: string | null
          id?: string
          id_number?: string | null
          photo_consent?: boolean
          special_needs?: string | null
          staff_notes?: string | null
          status?: string
          student_email?: string | null
          student_name: string
          student_phone?: string | null
          subjects?: string[]
        }
        Update: {
          agreed_terms?: boolean
          attendance_mode?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_name?: string | null
          emergency_phone?: string | null
          emergency_relationship?: string | null
          grade_level?: string | null
          guardian1_address?: string | null
          guardian1_email?: string
          guardian1_id?: string | null
          guardian1_name?: string
          guardian1_phone?: string
          guardian1_relationship?: string | null
          guardian1_work_phone?: string | null
          guardian2_address?: string | null
          guardian2_email?: string | null
          guardian2_id?: string | null
          guardian2_name?: string | null
          guardian2_phone?: string | null
          guardian2_relationship?: string | null
          guardian2_work_phone?: string | null
          id?: string
          id_number?: string | null
          photo_consent?: boolean
          special_needs?: string | null
          staff_notes?: string | null
          status?: string
          student_email?: string | null
          student_name?: string
          student_phone?: string | null
          subjects?: string[]
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          active: boolean
          created_at: string
          created_by: string | null
          created_by_name: string
          email: string | null
          employment_type: string
          first_name: string | null
          gender: string | null
          id: string
          last_name: string | null
          marital_status: string | null
          phone: string | null
          physical_address: string | null
          roles: string[]
          specified_role: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          created_by_name?: string
          email?: string | null
          employment_type?: string
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          marital_status?: string | null
          phone?: string | null
          physical_address?: string | null
          roles?: string[]
          specified_role?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          created_by_name?: string
          email?: string | null
          employment_type?: string
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          marital_status?: string | null
          phone?: string | null
          physical_address?: string | null
          roles?: string[]
          specified_role?: string | null
          updated_at?: string
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
          role: Database["public"]["Enums"]["app_role"]
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "staff"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "staff"],
    },
  },
} as const
