import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

// Singleton-Instanz für den Server-Client
let serverClientInstance: ReturnType<typeof createServerComponentClient<Database>> | null = null;

export const createClient = () => {
  if (serverClientInstance) return serverClientInstance;

  const cookieStore = cookies();
  serverClientInstance = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });

  return serverClientInstance;
};

export const getServerSupabaseClient = () => {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
};
