import { NextRequest, NextResponse } from 'next/server';
import { generateToken, verifyToken } from './auth';

export async function generateCsrfToken() {
  return generateToken({ purpose: 'csrf' });
}

export async function validateCsrfToken(req: NextRequest) {
  const token = req.headers.get('x-csrf-token');
  
  if (!token) {
    return false;
  }

  try {
    const payload = await verifyToken(token);
    return payload?.purpose === 'csrf';
  } catch {
    return false;
  }
}

export function csrfProtection(handler: Function) {
  return async function csrfMiddleware(req: NextRequest, res: NextResponse) {
    if (req.method !== 'GET') {
      const isValid = await validateCsrfToken(req);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid CSRF token' },
          { status: 403 }
        );
      }
    }
    return handler(req, res);
  };
}