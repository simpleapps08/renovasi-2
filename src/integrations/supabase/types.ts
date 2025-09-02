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
      deposits: {
        Row: {
          bukti_transfer_url: string | null
          catatan: string | null
          created_at: string
          id: string
          metode: string
          nominal: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bukti_transfer_url?: string | null
          catatan?: string | null
          created_at?: string
          id?: string
          metode: string
          nominal: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bukti_transfer_url?: string | null
          catatan?: string | null
          created_at?: string
          id?: string
          metode?: string
          nominal?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gallery: {
        Row: {
          caption: string | null
          created_at: string
          foto_url: string
          id: string
          updated_at: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          foto_url: string
          id?: string
          updated_at?: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          foto_url?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      labour_rates: {
        Row: {
          created_at: string
          harga_borongan: number | null
          harga_harian: number | null
          id: string
          jenis_pekerjaan: string
          lokasi: string | null
          satuan: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          harga_borongan?: number | null
          harga_harian?: number | null
          id?: string
          jenis_pekerjaan: string
          lokasi?: string | null
          satuan: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          harga_borongan?: number | null
          harga_harian?: number | null
          id?: string
          jenis_pekerjaan?: string
          lokasi?: string | null
          satuan?: string
          updated_at?: string
        }
        Relationships: []
      }
      materials: {
        Row: {
          created_at: string
          harga: number
          id: string
          kategori: string
          kualitas: string
          lokasi: string | null
          nama: string
          satuan: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          harga: number
          id?: string
          kategori: string
          kualitas: string
          lokasi?: string | null
          nama: string
          satuan: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          harga?: number
          id?: string
          kategori?: string
          kualitas?: string
          lokasi?: string | null
          nama?: string
          satuan?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          lokasi: string | null
          nama: string
          role: string
          saldo_deposit: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lokasi?: string | null
          nama: string
          role?: string
          saldo_deposit?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lokasi?: string | null
          nama?: string
          role?: string
          saldo_deposit?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          bahan: string | null
          breakdown_material: number | null
          breakdown_tenaga_kerja: number | null
          created_at: string
          foto_url: string | null
          hasil_estimasi: number | null
          id: string
          jenis_pekerjaan: string
          lokasi: string | null
          luas_area: number | null
          spesifikasi: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bahan?: string | null
          breakdown_material?: number | null
          breakdown_tenaga_kerja?: number | null
          created_at?: string
          foto_url?: string | null
          hasil_estimasi?: number | null
          id?: string
          jenis_pekerjaan: string
          lokasi?: string | null
          luas_area?: number | null
          spesifikasi?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bahan?: string | null
          breakdown_material?: number | null
          breakdown_tenaga_kerja?: number | null
          created_at?: string
          foto_url?: string | null
          hasil_estimasi?: number | null
          id?: string
          jenis_pekerjaan?: string
          lokasi?: string | null
          luas_area?: number | null
          spesifikasi?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
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
    Enums: {},
  },
} as const
