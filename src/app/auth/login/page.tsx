'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Prüfe beim Laden, ob bereits eine Session existiert
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/admin');
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Versuche den Login
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          // Wenn der Login fehlschlägt, versuche eine Registrierung
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password
          });

          if (signUpError) throw signUpError;

          // Erstelle das Admin-Profil
          if (signUpData?.user) {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: signUpData.user.id,
                  email: signUpData.user.email,
                  role: 'admin'
                }
              ]);

            if (profileError) throw profileError;

            // Versuche erneut den Login
            const { error: newSignInError } = await supabase.auth.signInWithPassword({
              email,
              password
            });

            if (newSignInError) throw newSignInError;
          }
        } else {
          throw signInError;
        }
      }

      // Prüfe die Admin-Rolle
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', signInData?.session?.user.id)
        .single();

      if (!profile?.role || profile.role !== 'admin') {
        throw new Error('Keine Admin-Berechtigung');
      }

      // Erfolgreich eingeloggt, leite weiter
      console.log('Login erfolgreich, leite weiter...');
      router.push('/admin');
      router.refresh();

    } catch (error: any) {
      console.error('Login Fehler:', error);
      if (error.message === 'User already registered') {
        setError('Bitte melden Sie sich mit Ihrem Passwort an.');
      } else if (error.message === 'Invalid login credentials') {
        setError('Ungültige Anmeldedaten. Bitte überprüfen Sie E-Mail und Passwort.');
      } else if (error.message === 'Keine Admin-Berechtigung') {
        setError('Sie haben keine Admin-Berechtigung.');
      } else {
        setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            JOK Cosmetics Admin
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Bitte melden Sie sich an
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                E-Mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="E-Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Passwort
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Anmeldung...
                </span>
              ) : (
                'Anmelden'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
