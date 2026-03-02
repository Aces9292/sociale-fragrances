import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Email configuration
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || 'info@socialefragrances.com';
const SMTP_PASS = process.env.SMTP_PASS || '';
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || 'info@socialefragrances.com';

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

// Generate order ID
function generateOrderId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `ORD-${timestamp}-${random}`.toUpperCase();
}

// Send customer confirmation email
async function sendCustomerConfirmation(orderData: any): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) return false;
  
  try {
    const itemsHtml = orderData.items.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} - ${item.size}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
      </tr>
    `).join('');

    await transporter.sendMail({
      from: `"SOCIALE Fragrances" <${SMTP_USER}>`,
      to: orderData.customerEmail,
      subject: `Order Confirmation #${orderData.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-family: Georgia, serif;">SOCIALE</h1>
            <p style="margin: 5px 0 0; font-size: 12px; letter-spacing: 2px;">FRAGRANCES</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <h2 style="font-family: Georgia, serif; margin-top: 0;">Thank you for your order!</h2>
            <p>Hi ${orderData.customerName},</p>
            <p>We've received your order and are preparing it for shipment.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #f5f5f5;">
                  <th style="padding: 10px; text-align: left;">Product</th>
                  <th style="padding: 10px; text-align: center;">Qty</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
                  <td style="padding: 10px; text-align: right;">$${orderData.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
                  <td style="padding: 10px; text-align: right;">$${orderData.shipping.toFixed(2)}</td>
                </tr>
                <tr style="background: #f5f5f5;">
                  <td colspan="2" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
                  <td style="padding: 10px; text-align: right;"><strong>$${orderData.total.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>
            
            <div style="background: #f9f9f9; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0; font-family: Georgia, serif;">Shipping Address</h3>
              <p style="margin: 0;">
                ${orderData.shippingAddress.name}<br>
                ${orderData.shippingAddress.line1}<br>
                ${orderData.shippingAddress.line2 ? orderData.shippingAddress.line2 + '<br>' : ''}
                ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.postal_code}
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Order #: ${orderData.orderId}<br>
              We'll send you another email when your order ships.
            </p>
          </div>
          
          <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p>Questions? Reply to this email or contact us at info@socialefragrances.com</p>
            <p>© 2026 SOCIALE Fragrances. All rights reserved.</p>
          </div>
        </div>
      `,
    });
    
    console.log(`✅ Customer confirmation sent to ${orderData.customerEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send customer confirmation:', error);
    return false;
  }
}

// Send business notification email
async function sendBusinessNotification(orderData: any): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) return false;
  
  try {
    const itemsText = orderData.items.map((item: any) => 
      `- ${item.name} (${item.size}) x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    await transporter.sendMail({
      from: `"SOCIALE Orders" <${SMTP_USER}>`,
      to: BUSINESS_EMAIL,
      subject: `🎉 NEW ORDER #${orderData.orderId} - $${orderData.total.toFixed(2)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 3px solid #000;">
          <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">🎉 NEW ORDER!</h1>
          </div>
          
          <div style="padding: 30px;">
            <h2>Order #${orderData.orderId}</h2>
            <p><strong>Customer:</strong> ${orderData.customerName}<br>
               <strong>Email:</strong> ${orderData.customerEmail}</p>
            
            <h3>Items:</h3>
            <ul>
              ${orderData.items.map((item: any) => `<li>${item.name} (${item.size}) x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
            </ul>
            
            <div style="background: #f5f5f5; padding: 15px; margin: 20px 0;">
              <h3 style="margin-top: 0;">TOTAL: $${orderData.total.toFixed(2)}</h3>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; margin: 20px 0;">
              <h4 style="margin-top: 0;">Shipping Address:</h4>
              <p style="margin: 0;">
                ${orderData.shippingAddress.name}<br>
                ${orderData.shippingAddress.line1}<br>
                ${orderData.shippingAddress.line2 ? orderData.shippingAddress.line2 + '<br>' : ''}
                ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.postal_code}
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://dashboard.stripe.com/payments" style="background: #000; color: #fff; padding: 15px 30px; text-decoration: none; display: inline-block;">
                View in Stripe Dashboard
              </a>
            </div>
          </div>
        </div>
      `,
    });
    
    console.log(`✅ Business notification sent to ${BUSINESS_EMAIL}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send business notification:', error);
    return false;
  }
}

// Get line items from Stripe session
async function getLineItems(sessionId: string) {
  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
      expand: ['data.price.product'],
    });
    
    const items = lineItems.data.map(item => {
      const product = item.price?.product as Stripe.Product | undefined;
      const metadata = product?.metadata || {};
      
      return {
        name: item.description || product?.name || 'Unknown Product',
        size: metadata.size || 'Standard',
        price: (item.amount_total || 0) / 100 / (item.quantity || 1),
        quantity: item.quantity || 1,
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
      // Get line items from Stripe
      const { items, subtotal } = await getLineItems(session.id);

      // Extract shipping address
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

      // Prepare order data
      const orderData = {
        orderId: generateOrderId(),
        stripeSessionId: session.id,
        customerEmail: session.customer_details?.email || '',
        customerName: session.customer_details?.name || 'Unknown Customer',
        items,
        subtotal: subtotal || (total - shippingCost),
        shipping: shippingCost,
        total,
        shippingAddress,
        createdAt: new Date().toISOString(),
      };

      console.log('📝 Order data prepared:', orderData.orderId);

      // Send emails (don't block on this)
      Promise.all([
        sendCustomerConfirmation(orderData),
        sendBusinessNotification(orderData),
      ]).then(([customerSent, businessSent]) => {
        console.log(`📧 Emails sent: Customer=${customerSent}, Business=${businessSent}`);
      }).catch(err => {
        console.error('📧 Email error:', err);
      });

      return NextResponse.json({ 
        received: true, 
        orderId: orderData.orderId,
        message: 'Order processed and emails sent',
      });

    } catch (error) {
      console.error('❌ Error processing checkout session:', error);
      return NextResponse.json({ 
        received: true, 
        error: 'Order processing error',
        details: error instanceof Error ? error.message : String(error),
      }, { status: 200 });
    }
  }

  return NextResponse.json({ received: true });
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    webhook: 'stripe',
    smtpConfigured: !!process.env.SMTP_PASS,
    webhookSecretConfigured: !!process.env.STRIPE_WEBHOOK_SECRET,
    businessEmail: process.env.BUSINESS_EMAIL || 'not set',
  });
}
