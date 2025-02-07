import type { NextRequest } from 'next/server';

declare module 'next/server' {
  interface NextRequest {
    nextUrl: URL;
  }
  
  interface RouteParams {
    params: Record<string, string>;
  }
}
