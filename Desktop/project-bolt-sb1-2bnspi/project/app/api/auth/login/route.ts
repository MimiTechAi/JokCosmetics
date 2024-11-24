import { NextRequest, NextResponse } from 'next/server';
import { generateToken, cookieOptions } from '@/lib/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    // Hier würden Sie normalerweise die Anmeldedaten gegen Ihre Datenbank prüfen
    // Für Entwicklungszwecke erlauben wir jeden Login
    const token = await generateToken({ 
      email,
      role: 'user'
    });

    // Setze Auth-Cookie
    cookies().set('token', token, cookieOptions);

    return NextResponse.json({ 
      success: true,
      message: 'Erfolgreich angemeldet'
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Ungültige Anmeldedaten' },
      { status: 401 }
    );
  }
}