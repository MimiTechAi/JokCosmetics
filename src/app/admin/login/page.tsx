'use client';

import { useState } from 'react';
import Image from 'next/image';
import { loginAction, clearAllCookies } from './actions';

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClearingCookies, setIsClearingCookies] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsLoading(true);

    try {
      console.log('Starte Login-Versuch...');
      const result = await loginAction(formData);
      console.log('Login-Ergebnis:', result);
      if (result?.error) {
        setError(result.error);
        console.error('Login-Fehler:', result.error);
      }
    } catch (error) {
      console.error('Unerwarteter Fehler:', error);
      setError(error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleClearCookies() {
    setIsClearingCookies(true);
    try {
      await clearAllCookies();
      window.location.reload(); // Seite neu laden nach dem Löschen
    } catch (error) {
      console.error('Fehler beim Löschen der Cookies:', error);
    } finally {
      setIsClearingCookies(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" role="main">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <Image
            src="/logo.svg"
            alt="Jok Cosmetics Logo"
            width={150}
            height={60}
            className="mx-auto"
            priority
          />
          <h1 className="text-2xl font-bold text-gray-900 mt-6">Admin Login</h1>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6" role="alert" aria-live="polite">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          handleSubmit(formData);
        }} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-Mail-Adresse
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="admin@example.com"
              aria-label="E-Mail-Adresse"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="••••••••"
              aria-label="Passwort"
            />
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="sr-only">Wird geladen...</span>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Anmeldung läuft...
                </>
              ) : (
                'Anmelden'
              )}
            </button>

            <button
              type="button"
              onClick={handleClearCookies}
              disabled={isClearingCookies}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isClearingCookies ? 'Cookies werden gelöscht...' : 'Alle Cookies löschen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
