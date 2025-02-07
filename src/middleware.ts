import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/database';

const COOKIE_OPTIONS = {
  name: 'sb-auth',
  lifetime: 60 * 60 * 24 * 7,
  domain: '',
  path: '/',
  sameSite: 'lax'
}

export async function middleware(request: NextRequest) {
  try {
    // Create response and Supabase client
    const res = NextResponse.next();
    const supabase = createMiddlewareClient<Database>({
      req: request,
      res,
      options: {
        auth: {
          persistSession: true,
          storageKey: 'sb-session',
          flowType: 'pkce',
          detectSessionInUrl: false
        },
        cookies: {
          ...COOKIE_OPTIONS,
          secure: process.env.NODE_ENV === 'production'
        }
      }
    });

    // Get session without manual token handling
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    // If on login page and has session, redirect to admin
    if (request.nextUrl.pathname === '/auth/login') {
      if (session) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return res;
    }

    // For admin routes, require session and admin role
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (!session) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }

      // Check admin role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return res;
  } catch (error) {
    console.error('[Middleware] Error:', error);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/auth/login']
};
