import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import { 
  createOrder, 
  getOrderByStripeSession, 
  generateOrderId,
  markEmailSent,
  Order,
} from '@/lib/orders-db';
import { 
  emailTemplates, 
  OrderData 
} from '@/lib/email-templates';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Email configuration
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || 'info@socialefragrances.com';
const SMTP_PASS = process.env.SMTP_PASS || '';
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || 'alex@socialefragrances.com';

// Create transporter
const getTransporter = () => {
  if (!SMTP_PASS) {
    console.warn('⚠️ SMTP_PASS not set - emails will not be sent');
    return null;
  }
  
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

// Convert Order to OrderData for email templates
function orderToEmailData(order: Order): OrderData {
  return {
    orderId: order.id,
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    items: order.items,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    shippingAddress: order.shippingAddress,
    trackingNumber: order.trackingNumber,
    trackingUrl: order.trackingUrl,
    createdAt: order.createdAt,
  };
}

// Send customer confirmation email
async function sendCustomerConfirmation(order: Order): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) return false;
  
  try {
    const emailData = orderToEmailData(order);
    const email = emailTemplates.customerConfirmation(emailData);
    
    await transporter.sendMail({
      from: `"SOCIALE Fragrances" <${SMTP_USER}>`,
      to: order.customerEmail,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
    
    console.log(`✅ Customer confirmation sent to ${order.customerEmail}`);
    await markEmailSent(order.id, 'confirmation');
    return true;
  } catch (error) {
    console.error('❌ Failed to send customer confirmation:', error);
    return false;
  }
}

// Send business notification email
async function sendBusinessNotification(order: Order): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) return false;
  
  try {
    const emailData = orderToEmailData(order);
    const email = emailTemplates.businessNotification(emailData);
    
    await transporter.sendMail({
      from: `"SOCIALE Orders" <${SMTP_USER}>`,
      to: BUSINESS_EMAIL,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
    
    console.log(`✅ Business notification sent to ${BUSINESS_EMAIL}`);
    await markEmailSent(order.id, 'businessNotification');
    return true;
  } catch (error) {
    console.error('❌ Failed to send business notification:', error);
    return false;
  }
}

// Extract line items from Stripe session
async function getLineItems(sessionId: string): Promise<{
  items: Order['items'];
  subtotal: number;
}> {
  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
      expand: ['data.price.product'],
    });
    
    const items: Order['items'] = lineItems.data.map(item => {
      const product = item.price?.product as Stripe.Product | undefined;
      const metadata = product?.metadata || {};
      
      return {
        name: item.description || product?.name || 'Unknown Product',
        size: metadata.size || 'Standard',
        price: (item.amount_total || 0) / 100 / (item.quantity || 1),
        quantity: item.quantity || 1,
        productId: product?.id,
      };
    });
    
    const subtotal = lineItems.data.reduce((sum, item) => 
      sum + ((item.amount_subtotal || 0) / 100), 0
    );
    
    return { items, subtotal };
  } catch (error) {
    console.error('Error fetching line items:', error);
    return { items: [], subtotal: 0 };
  }
}

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  // Verify webhook signature
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } else {
      // For testing without webhook secret (not recommended for production)
      console.warn('⚠️ STRIPE_WEBHOOK_SECRET not set - skipping signature verification');
      event = JSON.parse(payload);
    }
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`📥 Received Stripe event: ${event.type}`);

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    console.log('✅ Payment successful!');
    console.log('Session ID:', session.id);
    console.log('Customer:', session.customer_details?.email);
    console.log('Amount:', session.amount_total);

    try {
      // Check if order already exists (prevent duplicates)
      const existingOrder = await getOrderByStripeSession(session.id);
      if (existingOrder) {
        console.log('⚠️ Order already exists for session:', session.id);
        return NextResponse.json({ received: true, orderId: existingOrder.id });
      }

      // Get line items from Stripe
      const { items, subtotal } = await getLineItems(session.id);

      // Extract shipping address
      // Try to get shipping from collected_information first, then customer_details
      const shippingInfo = (session as any).shipping_details || 
                          (session as any).collected_information?.shipping_details ||
                          session.customer_details;
      const shippingAddress = {
        name: shippingInfo?.name || session.customer_details?.name || 'Unknown',
        line1: shippingInfo?.address?.line1 || session.customer_details?.address?.line1 || '',
        line2: shippingInfo?.address?.line2 || session.customer_details?.address?.line2 || undefined,
        city: shippingInfo?.address?.city || session.customer_details?.address?.city || '',
        state: shippingInfo?.address?.state || session.customer_details?.address?.state || '',
        postal_code: shippingInfo?.address?.postal_code || session.customer_details?.address?.postal_code || '',
        country: shippingInfo?.address?.country || session.customer_details?.address?.country || 'US',
      };

      // Calculate totals
      const total = (session.amount_total || 0) / 100;
      const shippingCost = (session.shipping_cost?.amount_total || 0) / 100;

      // Create order
      const order = await createOrder({
        id: generateOrderId(),
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string | undefined,
        customerEmail: session.customer_details?.email || '',
        customerName: session.customer_details?.name || 'Unknown Customer',
        items,
        subtotal: subtotal || (total - shippingCost),
        shipping: shippingCost,
        total,
        status: 'pending',
        shippingAddress,
        createdAt: new Date().toISOString(),
      });

      console.log('📝 Order created:', order.id);

      // Send emails (async, don't block webhook response)
      Promise.all([
        sendCustomerConfirmation(order),
        sendBusinessNotification(order),
      ]).then(([customerSent, businessSent]) => {
        console.log(`📧 Emails: Customer=${customerSent}, Business=${businessSent}`);
      }).catch(err => {
        console.error('📧 Email sending error:', err);
      });

      return NextResponse.json({ 
        received: true, 
        orderId: order.id,
        message: 'Order created successfully',
      });

    } catch (error) {
      console.error('❌ Error processing checkout session:', error);
      // Still return 200 to prevent Stripe from retrying
      return NextResponse.json({ 
        received: true, 
        error: 'Order processing error',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Handle other events (for future use)
  if (event.type === 'payment_intent.succeeded') {
    console.log('💳 Payment intent succeeded');
  }

  if (event.type === 'charge.refunded') {
    console.log('💸 Charge refunded');
    // TODO: Update order status to refunded
  }

  return NextResponse.json({ received: true });
}

// Also support GET for testing/health check
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    webhook: 'stripe',
    smtpConfigured: !!process.env.SMTP_PASS,
    webhookSecretConfigured: !!process.env.STRIPE_WEBHOOK_SECRET,
  });
}
