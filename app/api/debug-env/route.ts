import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    keyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10) || 'NOT SET',
    allEnvKeys: Object.keys(process.env).filter(k => k.includes('STRIPE')),
  });
}
