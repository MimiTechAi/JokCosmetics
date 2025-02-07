import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { userId, role } = await request.json();
    
    if (!userId || !role || !['admin', 'user'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Prüfe ob der anfragende Benutzer Admin ist
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!adminProfile?.role || adminProfile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Keine Admin-Berechtigung' },
        { status: 403 }
      );
    }

    // Setze die Rolle für den Benutzer
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating role:', updateError);
      return NextResponse.json(
        { error: 'Fehler beim Aktualisieren der Rolle' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Rolle erfolgreich aktualisiert' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in set-role API:', error);
    return NextResponse.json(
      { error: 'Interner Server-Fehler' },
      { status: 500 }
    );
  }
}
