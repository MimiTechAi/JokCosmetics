import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Clear auth cookies
  cookies().delete('token');
  cookies().delete('refreshToken');
  cookies().delete('csrf-token');

  return NextResponse.json({ success: true });
}