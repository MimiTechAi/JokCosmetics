import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  limit: number;
  windowMs: number;
}

const ipRequests = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(config: RateLimitConfig) {
  return async function rateLimitMiddleware(
    req: NextRequest
  ): Promise<NextResponse | undefined> {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    const requestData = ipRequests.get(ip);

    if (!requestData || now > requestData.resetTime) {
      ipRequests.set(ip, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return;
    }

    if (requestData.count >= config.limit) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    requestData.count++;
    return;
  };
}