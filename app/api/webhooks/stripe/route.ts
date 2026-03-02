import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Your email for notifications
const BUSINESS_EMAIL = 'info@socialefragrances.com';

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    console.log('✅ Payment successful!');
    console.log('Session ID:', session.id);
    console.log('Customer:', session.customer_details?.email);
    console.log('Amount:', session.amount_total);
    console.log('Shipping:', session.collected_information);

    // Here you would typically:
    // 1. Send yourself an email notification
    // 2. Update inventory
    // 3. Add to your order management system
    // 4. Send customer confirmation email (Stripe does this automatically if enabled)

    // For now, just log it - you can check Vercel logs for notifications
    // TODO: Add email service integration (SendGrid, Postmark, etc.)
  }

  return NextResponse.json({ received: true });
}