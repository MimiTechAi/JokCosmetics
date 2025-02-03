'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/auth/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role, email')
          .eq('id', session.user.id)
          .single();

        if (!profile?.role || profile.role !== 'admin') {
          router.push('/auth/login');
          return;
        }

        setAdminEmail(profile.email || session.user.email || '');
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{adminEmail}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
            >
              Abmelden
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Willkommen im Admin-Bereich</h2>
          <p className="text-gray-600">
            Hier können Sie Ihre Website verwalten. Weitere Funktionen werden in Kürze hinzugefügt.
          </p>
        </div>

        {/* Placeholder für zukünftige Features */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {['Buchungen', 'Kunden', 'Einstellungen'].map((feature) => (
            <div key={feature} className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">{feature}</h3>
              <p className="text-gray-600">
                Diese Funktion wird in Kürze verfügbar sein.
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
