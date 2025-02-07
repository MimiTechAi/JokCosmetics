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
      admin_activities: {
        Row: {
          action_details: Json
          action_type: string
          admin_email: string
          created_at: string | null
          id: string
          ip_address: string | null
        }
        Insert: {
          action_details: Json
          action_type: string
          admin_email: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
        }
        Update: {
          action_details?: Json
          action_type?: string
          admin_email?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          setting_key: string
          setting_value: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_statistics: {
        Row: {
          cancelled_bookings: number | null
          confirmed_bookings: number | null
          created_at: string | null
          date: string
          id: number
          total_bookings: number | null
          total_revenue: number | null
          updated_at: string | null
        }
        Insert: {
          cancelled_bookings?: number | null
          confirmed_bookings?: number | null
          created_at?: string | null
          date: string
          id?: number
          total_bookings?: number | null
          total_revenue?: number | null
          updated_at?: string | null
        }
        Update: {
          cancelled_bookings?: number | null
          confirmed_bookings?: number | null
          created_at?: string | null
          date?: string
          id?: number
          total_bookings?: number | null
          total_revenue?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          auth_id: string | null
          created_at: string | null
          email: string
          id: string
          updated_at: string | null
        }
        Insert: {
          auth_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          auth_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      availability: {
        Row: {
          created_at: string | null
          date: string
          id: number
          is_blocked: boolean | null
          time_slots: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: number
          is_blocked?: boolean | null
          time_slots: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: number
          is_blocked?: boolean | null
          time_slots?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_date: string
          booking_time: string
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          notes: string | null
          phone: string
          service_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          booking_date: string
          booking_time: string
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          phone: string
          service_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          booking_date?: string
          booking_time?: string
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          phone?: string
          service_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      business_hours: {
        Row: {
          by_appointment: boolean | null
          close_time: string
          created_at: string
          day_of_week: string
          id: string
          open_time: string
          updated_at: string
        }
        Insert: {
          by_appointment?: boolean | null
          close_time: string
          created_at?: string
          day_of_week: string
          id?: string
          open_time: string
          updated_at?: string
        }
        Update: {
          by_appointment?: boolean | null
          close_time?: string
          created_at?: string
          day_of_week?: string
          id?: string
          open_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_history: {
        Row: {
          ai_response: string
          id: string
          timestamp: string
          user_message: string
        }
        Insert: {
          ai_response: string
          id?: string
          timestamp?: string
          user_message: string
        }
        Update: {
          ai_response?: string
          id?: string
          timestamp?: string
          user_message?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
        }
        Relationships: []
      }
      notification_history: {
        Row: {
          booking_id: number | null
          content: string
          created_at: string | null
          error_message: string | null
          id: string
          notification_type: string
          queue_id: string | null
          recipient_email: string | null
          recipient_phone: string | null
          sent_at: string | null
          status: string
          subject: string | null
        }
        Insert: {
          booking_id?: number | null
          content: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          notification_type: string
          queue_id?: string | null
          recipient_email?: string | null
          recipient_phone?: string | null
          sent_at?: string | null
          status: string
          subject?: string | null
        }
        Update: {
          booking_id?: number | null
          content?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          notification_type?: string
          queue_id?: string | null
          recipient_email?: string | null
          recipient_phone?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_history_queue_id_fkey"
            columns: ["queue_id"]
            isOneToOne: false
            referencedRelation: "notification_queue"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_queue: {
        Row: {
          attempts: number | null
          booking_id: number | null
          content: string
          created_at: string | null
          error_message: string | null
          id: string
          last_attempt: string | null
          notification_type: string
          recipient_email: string | null
          recipient_phone: string | null
          status: string
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          attempts?: number | null
          booking_id?: number | null
          content: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          last_attempt?: string | null
          notification_type: string
          recipient_email?: string | null
          recipient_phone?: string | null
          status?: string
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          attempts?: number | null
          booking_id?: number | null
          content?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          last_attempt?: string | null
          notification_type?: string
          recipient_email?: string | null
          recipient_phone?: string | null
          status?: string
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          booking_id: number | null
          created_at: string | null
          id: string
          sent_at: string | null
          status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          booking_id?: number | null
          created_at?: string | null
          id?: string
          sent_at?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          booking_id?: number | null
          created_at?: string | null
          id?: string
          sent_at?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: number | null
          comment: string | null
          created_at: string | null
          id: string
          is_published: boolean | null
          rating: number
          updated_at: string | null
        }
        Insert: {
          booking_id?: number | null
          comment?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          rating: number
          updated_at?: string | null
        }
        Update: {
          booking_id?: number | null
          comment?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          rating?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          before_after_images: string[] | null
          benefits: string[] | null
          category_id: string | null
          created_at: string | null
          custom_fields: Json | null
          description: string
          duration: string
          features: Json | null
          id: string
          image_url: string | null
          is_active: boolean | null
          price: string
          seo_description: string | null
          seo_title: string | null
          slug: string | null
          sort_order: number | null
          techniques: string[] | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          before_after_images?: string[] | null
          benefits?: string[] | null
          category_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          description: string
          duration: string
          features?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          price: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string | null
          sort_order?: number | null
          techniques?: string[] | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          before_after_images?: string[] | null
          benefits?: string[] | null
          category_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: string
          duration?: string
          features?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          price?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string | null
          sort_order?: number | null
          techniques?: string[] | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          admin_id: string | null
          break_time: Json | null
          business_hours: Json | null
          created_at: string | null
          id: string
          role: string
          sensitive: boolean | null
          setting_key: string
          setting_value: Json | null
          updated_at: string | null
        }
        Insert: {
          admin_id?: string | null
          break_time?: Json | null
          business_hours?: Json | null
          created_at?: string | null
          id?: string
          role: string
          sensitive?: boolean | null
          setting_key: string
          setting_value?: Json | null
          updated_at?: string | null
        }
        Update: {
          admin_id?: string | null
          break_time?: Json | null
          business_hours?: Json | null
          created_at?: string | null
          id?: string
          role?: string
          sensitive?: boolean | null
          setting_key?: string
          setting_value?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      confirm_user: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      exec_sql: {
        Args: {
          sql_query: string
        }
        Returns: undefined
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      truncate_table: {
        Args: {
          table_name: string
        }
        Returns: undefined
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
