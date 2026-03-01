import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is HTTP (not HTTPS)
  const url = request.nextUrl.clone();
  
  // In production, force HTTPS
  if (process.env.NODE_ENV === 'production' && 
      request.headers.get('x-forwarded-proto') !== 'https') {
    url.protocol = 'https';
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};