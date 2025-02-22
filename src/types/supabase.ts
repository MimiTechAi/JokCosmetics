import { createClient } from '@supabase/supabase-js'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          // Add other profile fields here
        }
      }
      services: {
        Row: {
          id: string;
          name: string;
          title: string;
          description: string;
          duration: number;
          price: number;
          category_id: string | null;
          image_url: string;
          is_active: boolean;
          before_after_images: string[] | null;
          benefits: string[] | null;
          created_at: string | null;
          custom_fields: Json;
          video_url: string | null;
        };
      },
      // Define your other public tables here
    }
  }
}

type Json = Record<string, unknown> | null;

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)