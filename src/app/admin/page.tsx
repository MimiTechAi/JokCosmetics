'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.push('/auth/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (!profile?.role || profile.role !== 'admin') {
          router.push('/auth/login');
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/auth/login');
      }
    }

    checkAuth();
  }, [router, supabase]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">
            Admin Dashboard
          </h1>
          <Button 
            variant="luxury"
            onClick={handleLogout}
            className="ml-4"
          >
            Abmelden
          </Button>
        </div>
        
        <div className="luxury-card">
          <h2 className="text-xl font-semibold gradient-text mb-4">
            Willkommen im Admin-Bereich
          </h2>
          <p className="text-muted-foreground">
            Hier können Sie Ihre Website-Inhalte verwalten.
          </p>
          
          {/* Admin Funktionen hier */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="luxury-card hover:scale-105 transition-transform cursor-pointer">
              <h3 className="text-lg font-semibold mb-2">Dienstleistungen</h3>
              <p className="text-sm text-muted-foreground">
                Verwalten Sie Ihre Dienstleistungen und Preise
              </p>
            </div>
            
            <div className="luxury-card hover:scale-105 transition-transform cursor-pointer">
              <h3 className="text-lg font-semibold mb-2">Termine</h3>
              <p className="text-sm text-muted-foreground">
                Überblick über alle Buchungen und Termine
              </p>
            </div>
            
            <div className="luxury-card hover:scale-105 transition-transform cursor-pointer">
              <h3 className="text-lg font-semibold mb-2">Einstellungen</h3>
              <p className="text-sm text-muted-foreground">
                Bearbeiten Sie die Website-Einstellungen
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
