'use client';

import Link from 'next/link';

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Authentifizierungsfehler
        </h2>
        <p className="text-gray-600">
          Bei der Anmeldung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.
        </p>
        <div className="mt-4">
          <Link
            href="/auth/login"
            className="inline-block px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors"
          >
            Zurück zur Anmeldung
          </Link>
        </div>
      </div>
    </div>
  );
}
