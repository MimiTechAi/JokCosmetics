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
          name: string
          description: string
          duration: number
          price: number
          is_active: boolean
          available_days: string[]
          category: string
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          duration: number
          price: number
          is_active?: boolean
          available_days?: string[]
          category: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          duration?: number
          price?: number
          is_active?: boolean
          available_days?: string[]
          category?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          customer_email: string
          customer_first_name: string
          customer_last_name: string
          customer_phone: string | null
          service_id: string
          start_time: string
          end_time: string
          notes: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_email: string
          customer_first_name: string
          customer_last_name: string
          customer_phone?: string | null
          service_id: string
          start_time: string
          end_time: string
          notes?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_email?: string
          customer_first_name?: string
          customer_last_name?: string
          customer_phone?: string | null
          service_id?: string
          start_time?: string
          end_time?: string
          notes?: string | null
          status?: string
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
          newsletter_opt_in: boolean
          reminder_opt_in: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          newsletter_opt_in?: boolean
          reminder_opt_in?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          newsletter_opt_in?: boolean
          reminder_opt_in?: boolean
          created_at?: string
          updated_at?: string
        }
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
