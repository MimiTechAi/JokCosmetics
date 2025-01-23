import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/database'

// Singleton-Instanz für den Server-Client
let serverClientInstance: ReturnType<typeof createServerClient<Database>> | null = null;

export const createClient = () => {
  if (serverClientInstance) return serverClientInstance;

  const cookieStore = cookies()

  serverClientInstance = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookies in edge functions
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookies in edge functions
          }
        },
      },
    }
  )

  return serverClientInstance;
}
