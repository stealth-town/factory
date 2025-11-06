export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      factory: {
        Row: {
          created_at: string
          current_level: number
          current_xp: number
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_level?: number
          current_xp?: number
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_level?: number
          current_xp?: number
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "factory_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      generator: {
        Row: {
          created_at: string
          current_level: number
          current_xp: number
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_level?: number
          current_xp?: number
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_level?: number
          current_xp?: number
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generator_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      generator_item_stats: {
        Row: {
          attribute_id: number
          calculated_value: number
          generator_item_id: string
        }
        Insert: {
          attribute_id: number
          calculated_value: number
          generator_item_id: string
        }
        Update: {
          attribute_id?: number
          calculated_value?: number
          generator_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generator_item_stats_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "item_attributes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generator_item_stats_generator_item_id_fkey"
            columns: ["generator_item_id"]
            isOneToOne: false
            referencedRelation: "generator_items"
            referencedColumns: ["id"]
          },
        ]
      }
      generator_items: {
        Row: {
          created_at: string | null
          equipped_slot_type_id: number | null
          generator_id: string
          id: string
          instance_rarity_id: number
          is_equipped: boolean
          item_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          equipped_slot_type_id?: number | null
          generator_id: string
          id?: string
          instance_rarity_id: number
          is_equipped?: boolean
          item_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          equipped_slot_type_id?: number | null
          generator_id?: string
          id?: string
          instance_rarity_id?: number
          is_equipped?: boolean
          item_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_equipped_slot_type"
            columns: ["equipped_slot_type_id"]
            isOneToOne: false
            referencedRelation: "item_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generator_items_generator_id_fkey"
            columns: ["generator_id"]
            isOneToOne: false
            referencedRelation: "generator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generator_items_instance_rarity_id_fkey"
            columns: ["instance_rarity_id"]
            isOneToOne: false
            referencedRelation: "item_rarity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generator_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "item_list"
            referencedColumns: ["id"]
          },
        ]
      }
      item_attribute_values: {
        Row: {
          attribute_id: number
          attribute_value: number
          item_id: number
        }
        Insert: {
          attribute_id: number
          attribute_value: number
          item_id: number
        }
        Update: {
          attribute_id?: number
          attribute_value?: number
          item_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_item_attribute_values_attribute_id"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "item_attributes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_item_attribute_values_item_id"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "item_list"
            referencedColumns: ["id"]
          },
        ]
      }
      item_attributes: {
        Row: {
          attribute_code: string
          attribute_description: string | null
          attribute_display_name: string
          created_at: string | null
          id: number
        }
        Insert: {
          attribute_code: string
          attribute_description?: string | null
          attribute_display_name: string
          created_at?: string | null
          id?: number
        }
        Update: {
          attribute_code?: string
          attribute_description?: string | null
          attribute_display_name?: string
          created_at?: string | null
          id?: number
        }
        Relationships: []
      }
      item_list: {
        Row: {
          created_at: string | null
          id: number
          item_description: string | null
          item_name: string
          item_rarity_id: number
          item_type_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          item_description?: string | null
          item_name: string
          item_rarity_id: number
          item_type_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          item_description?: string | null
          item_name?: string
          item_rarity_id?: number
          item_type_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "item_list_item_rarity_id_fkey"
            columns: ["item_rarity_id"]
            isOneToOne: false
            referencedRelation: "item_rarity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_list_item_type_id_fkey"
            columns: ["item_type_id"]
            isOneToOne: false
            referencedRelation: "item_types"
            referencedColumns: ["id"]
          },
        ]
      }
      item_rarity: {
        Row: {
          created_at: string | null
          id: number
          rarity_code: string
          rarity_display_name: string
          rarity_drop_chance: number
          rarity_stat_multiplier_percentage: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          rarity_code: string
          rarity_display_name: string
          rarity_drop_chance: number
          rarity_stat_multiplier_percentage: number
        }
        Update: {
          created_at?: string | null
          id?: number
          rarity_code?: string
          rarity_display_name?: string
          rarity_drop_chance?: number
          rarity_stat_multiplier_percentage?: number
        }
        Relationships: []
      }
      item_types: {
        Row: {
          created_at: string | null
          id: number
          type_code: string
          type_description: string | null
          type_display_name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          type_code: string
          type_description?: string | null
          type_display_name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          type_code?: string
          type_description?: string | null
          type_display_name?: string
        }
        Relationships: []
      }
      user_balances_logs: {
        Row: {
          created_at: string
          id: string
          transaction_amount: number
          transaction_direction: string
          transaction_hash: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          transaction_amount?: number
          transaction_direction?: string
          transaction_hash?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          transaction_amount?: number
          transaction_direction?: string
          transaction_hash?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_balances_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          balance: number
          created_at: string
          id: string
          nickname: string | null
          updated_at: string
          wallet_address: string
          wallet_chain: string | null
        }
        Insert: {
          balance?: number
          created_at?: string
          id: string
          nickname?: string | null
          updated_at?: string
          wallet_address: string
          wallet_chain?: string | null
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          nickname?: string | null
          updated_at?: string
          wallet_address?: string
          wallet_chain?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

