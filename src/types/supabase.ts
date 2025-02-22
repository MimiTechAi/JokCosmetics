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
      // Define your other public tables here
    }
  }
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)