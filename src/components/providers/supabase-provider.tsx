'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase'
import { createContext, useContext, useState, useEffect } from 'react'

const Context = createContext<{
  supabase: ReturnType<typeof createClientComponentClient<Database>> | null;
}>({
  supabase: null
})

export function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabase, setSupabase] = useState<ReturnType<typeof createClientComponentClient<Database>> | null>(null);

  useEffect(() => {
    // Initialisiere Supabase nur auf der Client-Seite
    const supabaseClient = createClientComponentClient<Database>();
    setSupabase(supabaseClient);
  }, []);

  return (
    <Context.Provider value={{ supabase }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }
  return context.supabase
}
