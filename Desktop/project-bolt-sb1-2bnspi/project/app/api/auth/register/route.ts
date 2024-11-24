import { NextRequest, NextResponse } from 'next/server';
import { generateTOTPSecret, generateQRCode } from '@/lib/2fa';
import { validatePassword, generateToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
  userType: z.enum(['buyer', 'seller']),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, userType } = registerSchema.parse(body);

    // Validate password strength
    if (!await validatePassword(password)) {
      return NextResponse.json({
        error: 'Password does not meet security requirements',
        requirements: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: true,
        }
      }, { status: 400 });
    }

    // Generate verification token
    const verificationToken = await generateToken({
      email,
      purpose: 'email-verification'
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    // Generate 2FA secret and QR code
    const totpSecret = await generateTOTPSecret();
    const qrCode = await generateQRCode(email, totpSecret);

    // In a real app, save user to database with hashed password,
    // TOTP secret, and verification status

    return NextResponse.json({
      success: true,
      message: 'Verification email sent',
      setup2FA: {
        qrCode,
        secret: totpSecret,
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}