'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/supabase/database-types'
import { createContext, useContext } from 'react'

const Context = createContext<{
  public: Database['public']
}>({
  public: {
    Tables: {},
    Views: {},
    Functions: {},
    Enums: {}
  }
})

export const supabase = createClientComponentClient<Database['public']>({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
})

export function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Context.Provider value={{ 
      public: {
        Tables: {},
        Views: {},
        Functions: {},
        Enums: {}
      } 
    }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }
  return context
}
