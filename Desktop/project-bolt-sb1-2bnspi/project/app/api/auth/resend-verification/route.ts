import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // In a real app, verify that the user exists and needs verification
    // const user = await db.user.findUnique({ where: { email } });
    // if (!user || user.emailVerified) {
    //   return NextResponse.json(
    //     { error: 'Invalid request' },
    //     { status: 400 }
    //   );
    // }

    const verificationToken = await generateToken({
      email,
      purpose: 'email-verification'
    });

    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Failed to resend verification email' },
      { status: 500 }
    );
  }
}