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
      services: {
        Row: {
          id: string
          category_id: string | null
          title: string
          description: string
          duration: string
          price: string
          image_url: string | null
          benefits: string[] | null
          features: Json | null
          techniques: string[] | null
          is_active: boolean
          sort_order: number
          slug: string | null
          seo_title: string | null
          seo_description: string | null
          video_url: string | null
          before_after_images: string[] | null
          custom_fields: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          title: string
          description: string
          duration: string
          price: string
          image_url?: string | null
          benefits?: string[] | null
          features?: Json | null
          techniques?: string[] | null
          is_active?: boolean
          sort_order?: number
          slug?: string | null
          seo_title?: string | null
          seo_description?: string | null
          video_url?: string | null
          before_after_images?: string[] | null
          custom_fields?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          title?: string
          description?: string
          duration?: string
          price?: string
          image_url?: string | null
          benefits?: string[] | null
          features?: Json | null
          techniques?: string[] | null
          is_active?: boolean
          sort_order?: number
          slug?: string | null
          seo_title?: string | null
          seo_description?: string | null
          video_url?: string | null
          before_after_images?: string[] | null
          custom_fields?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      service_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          whatsapp: string | null
          preferred_contact: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['customers']['Insert']>
      }
      bookings: {
        Row: {
          id: string
          customer_id: string
          service_id: string
          start_time: string
          end_time: string
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
      }
      business_hours: {
        Row: {
          id: string
          day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
          open_time: string
          close_time: string
          is_closed: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['business_hours']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['business_hours']['Insert']>
      }
      blocked_dates: {
        Row: {
          id: string
          date: string
          reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['blocked_dates']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['blocked_dates']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          booking_id: string
          type: string
          status: string
          sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          service_id: string
          customer_name: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
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
  }
}
