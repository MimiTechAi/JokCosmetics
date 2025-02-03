import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  
  // Hole die Session
  const { data: { session } } = await supabase.auth.getSession();

  // Wenn wir im Admin-Bereich sind
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      // Keine Session vorhanden, zur Login-Seite
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Prüfe Admin-Berechtigung
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile?.role || profile.role !== 'admin') {
      // Keine Admin-Berechtigung, zur Login-Seite
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Wenn wir auf der Login-Seite sind und eine Session haben
  if (request.nextUrl.pathname === '/auth/login' && session) {
    // Leite zum Admin-Bereich weiter
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/auth/login']
};
