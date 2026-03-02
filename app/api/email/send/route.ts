import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email configuration
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || 'Orders@socialefragrances.com';
const SMTP_PASS = process.env.SMTP_PASS || '';
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || 'alex@socialefragrances.com';

// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

interface OrderItem {
  name: string;
  size: string;
  price: number;
  quantity: number;
}

interface OrderData {
  orderId: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
  };
}

// Customer order confirmation email
export async function sendCustomerConfirmation(order: OrderData) {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} - ${item.size}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"SOCIALE Fragrances" <${SMTP_USER}>`,
    to: order.customerEmail,
    subject: `Order Confirmation #${order.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-family: Georgia, serif;">SOCIALE</h1>
          <p style="margin: 5px 0 0; font-size: 12px; letter-spacing: 2px;">FRAGRANCES</p>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="font-family: Georgia, serif; margin-top: 0;">Thank you for your order!</h2>
          <p>Hi ${order.customerName},</p>
          <p>We've received your order and are preparing it for shipment. Here's what you ordered:</p>
          
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
                <td style="padding: 10px; text-align: right;">$${order.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
                <td style="padding: 10px; text-align: right;">$${order.shipping.toFixed(2)}</td>
              </tr>
              <tr style="background: #f5f5f5;">
                <td colspan="2" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
                <td style="padding: 10px; text-align: right;"><strong>$${order.total.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
          
          <div style="background: #f9f9f9; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; font-family: Georgia, serif;">Shipping Address</h3>
            <p style="margin: 0;">
              ${order.shippingAddress.name}<br>
              ${order.shippingAddress.line1}<br>
              ${order.shippingAddress.line2 ? order.shippingAddress.line2 + '<br>' : ''}
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postal_code}
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Order #: ${order.orderId}<br>
            We'll send you another email when your order ships.
          </p>
        </div>
        
        <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>Questions? Reply to this email or contact us at info@socialefragrances.com</p>
          <p>© 2026 SOCIALE Fragrances. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

// Business new order notification
export async function sendBusinessNotification(order: OrderData) {
  const itemsText = order.items.map(item => 
    `- ${item.name} (${item.size}) x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
  ).join('\n');

  const mailOptions = {
    from: `"SOCIALE Orders" <${SMTP_USER}>`,
    to: BUSINESS_EMAIL,
    subject: `🎉 NEW ORDER #${order.orderId} - $${order.total.toFixed(2)}`,
    text: `
NEW ORDER RECEIVED!

Order #: ${order.orderId}
Customer: ${order.customerName}
Email: ${order.customerEmail}

ITEMS:
${itemsText}

TOTAL: $${order.total.toFixed(2)}

SHIPPING ADDRESS:
${order.shippingAddress.name}
${order.shippingAddress.line1}
${order.shippingAddress.line2 || ''}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postal_code}

View order in Stripe Dashboard:
https://dashboard.stripe.com/payments
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 3px solid #000;">
        <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">🎉 NEW ORDER!</h1>
        </div>
        
        <div style="padding: 30px;">
          <h2>Order #${order.orderId}</h2>
          <p><strong>Customer:</strong> ${order.customerName}<br>
             <strong>Email:</strong> ${order.customerEmail}</p>
          
          <h3>Items:</h3>
          <ul>
            ${order.items.map(item => `<li>${item.name} (${item.size}) x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
          </ul>
          
          <div style="background: #f5f5f5; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0;">TOTAL: $${order.total.toFixed(2)}</h3>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; margin: 20px 0;">
            <h4 style="margin-top: 0;">Shipping Address:</h4>
            <p style="margin: 0;">
              ${order.shippingAddress.name}<br>
              ${order.shippingAddress.line1}<br>
              ${order.shippingAddress.line2 ? order.shippingAddress.line2 + '<br>' : ''}
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postal_code}
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
  };

  return transporter.sendMail(mailOptions);
}

// Test email endpoint
export async function POST(request: Request) {
  try {
    const { type, order } = await request.json();

    if (type === 'test') {
      // Send test email
      await transporter.sendMail({
        from: `"SOCIALE Test" <${SMTP_USER}>`,
        to: BUSINESS_EMAIL,
        subject: 'Test Email from SOCIALE',
        text: 'This is a test email. Your email system is working!',
      });
      return NextResponse.json({ success: true, message: 'Test email sent' });
    }

    if (type === 'customer-confirmation') {
      await sendCustomerConfirmation(order);
      return NextResponse.json({ success: true, message: 'Customer confirmation sent' });
    }

    if (type === 'business-notification') {
      await sendBusinessNotification(order);
      return NextResponse.json({ success: true, message: 'Business notification sent' });
    }

    return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ 
      error: 'Failed to send email', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}