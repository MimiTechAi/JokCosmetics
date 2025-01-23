'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { Database } from '@/types/database';

const AuthContext = createContext<{
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}>({
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isAdmin: false,
    isLoading: true
  });

  const supabase = useMemo(() => createClientComponentClient<Database>(), []);

  useEffect(() => {
    let mounted = true;

    const handleAuthChange = async (session: any) => {
      if (!mounted) return;

      try {
        if (session) {
          const { data: adminStatus } = await supabase.rpc('is_admin', {
            user_id: session.user.id
          });

          if (mounted) {
            setAuthState({
              isAuthenticated: true,
              isAdmin: !!adminStatus,
              isLoading: false
            });
          }
        } else {
          if (mounted) {
            setAuthState({
              isAuthenticated: false,
              isAdmin: false,
              isLoading: false
            });
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          setAuthState({
            isAuthenticated: false,
            isAdmin: false,
            isLoading: false
          });
        }
      }
    };

    // Initial auth check
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session);
    });

    // Set up auth state change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        handleAuthChange(session);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
