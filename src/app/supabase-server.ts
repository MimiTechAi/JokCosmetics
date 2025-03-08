import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import { unstable_noStore as noStore } from 'next/cache'

export const createServerClient = () => {
  // Verhindern der statischen Generierung
  noStore()
  
  const cookieStore = cookies()
  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
  })
}
