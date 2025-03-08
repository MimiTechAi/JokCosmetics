import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';
import { unstable_noStore as noStore } from 'next/cache';

// Singleton-Instanz für den Server-Client
let serverClientInstance: ReturnType<typeof createServerComponentClient<Database>> | null = null;

export const createClient = () => {
  // Verhindern der statischen Generierung
  noStore();
  
  if (serverClientInstance) return serverClientInstance;

  const cookieStore = cookies();
  serverClientInstance = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });

  return serverClientInstance;
};

export const getServerSupabaseClient = () => {
  // Verhindern der statischen Generierung
  noStore();
  
  const cookieStore = cookies();
  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
};
