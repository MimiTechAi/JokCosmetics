import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ResetDatabaseButton from './ResetDatabaseButton';

export default async function ResetPage() {
  const supabase = createServerComponentClient({ cookies });

  // Prüfe Admin-Berechtigung
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!adminUser) {
    redirect('/');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Datenbank zurücksetzen</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">⚠️ Warnung</h2>
          <p className="text-gray-600 mb-4">
            Diese Aktion wird alle Buchungen und Services aus der Datenbank löschen.
            Dieser Vorgang kann nicht rückgängig gemacht werden.
          </p>
        </div>
        <ResetDatabaseButton />
      </div>
    </div>
  );
}
