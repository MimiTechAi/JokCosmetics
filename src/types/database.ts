export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export interface Database {
  public: {
    Tables: {
      services: {
        Row: {
          id: string
          name: string
          description: string
          duration: number
          price: number
          category: string
          image_url: string | null
          created_at: string
          updated_at: string
          available_days: DayOfWeek[]
          max_daily_bookings: number
          is_active: boolean
        }
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['services']['Insert']>
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
          day_of_week: DayOfWeek
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
