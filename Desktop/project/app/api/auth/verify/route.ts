import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token');
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/error?error=missing-token', req.url));
    }

    const payload = await verifyToken(token);
    if (!payload || payload.purpose !== 'email-verification') {
      return NextResponse.redirect(new URL('/auth/error?error=invalid-token', req.url));
    }

    // In a real app, update user's verified status in database
    // await db.user.update({
    //   where: { email: payload.email },
    //   data: { emailVerified: true, verificationToken: null }
    // });

    return NextResponse.redirect(new URL('/auth/verified', req.url));
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.redirect(new URL('/auth/error?error=verification-failed', req.url));
  }
}