import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Erstelle den Supabase-Client mit der neuen SSR-API
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          });
          res.headers.append('Set-Cookie', req.cookies.get(name)!.value);
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.delete({
            name,
            ...options,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
          });
          res.headers.append('Set-Cookie', `${name}=; Max-Age=0; Path=/`);
        },
      },
    }
  );

  // Hole die Session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // URL-Pfad
  const path = req.nextUrl.pathname;

  // Wenn es sich um eine API-Route handelt
  if (path.startsWith('/api/')) {
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }
    return res;
  }

  // Wenn es sich um eine Admin-Route handelt
  if (path.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    try {
      // Überprüfe Admin-Rolle
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        console.log('Kein Admin-Zugriff:', profile);
        return NextResponse.redirect(new URL('/', req.url));
      }
    } catch (error) {
      console.error('Fehler bei der Rollen-Überprüfung:', error);
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
    '/login',
    '/register',
  ],
};
