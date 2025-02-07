import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ 
        status: 'error',
        message: 'Nicht eingeloggt',
        session: null
      });
    }

    // Check if profiles table exists
    const { data: tableInfo, error: tableError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (tableError) {
      return NextResponse.json({ 
        status: 'error',
        message: 'Profiles Tabelle existiert nicht',
        error: tableError
      });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ 
        status: 'error',
        message: 'Profil nicht gefunden',
        error: profileError
      });
    }

    return NextResponse.json({
      status: 'success',
      session: {
        id: session.user.id,
        email: session.user.email
      },
      profile: profile
    });

  } catch (error) {
    console.error('Check admin error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Interner Server-Fehler',
      error: error
    });
  }
}
