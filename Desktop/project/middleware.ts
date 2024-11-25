import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Pfade, die ohne Authentifizierung zugänglich sind
const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/verify',
  '/auth/verified',
  '/auth/error',
  '/',
  '/api/auth'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Erlaube öffentliche Pfade
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Prüfe Auth-Token
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Token ist gültig, erlaube Request
    return NextResponse.next();
  } catch (error) {
    // Bei ungültigem Token zum Login umleiten
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

// Konfiguriere, welche Pfade durch den Middleware geschützt werden sollen
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*'
  ]
};