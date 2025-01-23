'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetDatabaseButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/admin/reset-database', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Fehler beim Zurücksetzen der Datenbank');
      }

      alert('Datenbank wurde erfolgreich zurückgesetzt');
      router.refresh();
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Fehler:', error);
      alert('Fehler beim Zurücksetzen der Datenbank');
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="space-x-4">
        <p className="mb-4 text-red-600 font-semibold">
          Sind Sie sicher, dass Sie die Datenbank zurücksetzen möchten?
        </p>
        <button
          onClick={handleReset}
          disabled={isLoading}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {isLoading ? 'Wird zurückgesetzt...' : 'Ja, zurücksetzen'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isLoading}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
        >
          Abbrechen
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Datenbank zurücksetzen
    </button>
  );
}
