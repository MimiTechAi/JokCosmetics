'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  try {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return { error: 'Login fehlgeschlagen: ' + signInError.message };
    }

    if (!signInData.session) {
      return { error: 'Keine Session nach Login' };
    }

    const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin', {
      user_id: signInData.session.user.id
    });

    if (adminError) {
      return { error: 'Fehler bei der Admin-Prüfung: ' + adminError.message };
    }

    if (!isAdmin) {
      return { error: 'Kein Admin-Zugriff für diesen Account' };
    }

    // Erfolgreicher Login
    redirect('/admin');
  } catch (error) {
    console.error('Unerwarteter Fehler beim Login:', error);
    return { error: 'Ein unerwarteter Fehler ist aufgetreten' };
  }
}

export async function clearAllCookies() {
  'use server';
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();
  
  for (const cookie of allCookies) {
    cookieStore.delete(cookie.name);
  }

  return { success: true };
}
