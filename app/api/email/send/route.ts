import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { emailTemplates, OrderData } from '@/lib/email-templates';

// Email configuration
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || 'info@socialefragrances.com';
const SMTP_PASS = process.env.SMTP_PASS || '';
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || 'alex@socialefragrances.com';

// Create transporter
const getTransporter = () => {
  if (!SMTP_PASS) {
    throw new Error('SMTP_PASS not configured. Add it to environment variables.');
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

// POST /api/email/send
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, order } = body;

    // Test email
    if (type === 'test') {
      const transporter = getTransporter();
      
      await transporter.sendMail({
        from: `"SOCIALE Test" <${SMTP_USER}>`,
        to: BUSINESS_EMAIL,
        subject: '✅ SOCIALE Email Test - Success!',
        text: `
This is a test email from SOCIALE Fragrances.

Your email system is configured correctly!

Sent at: ${new Date().toLocaleString()}
SMTP Host: ${SMTP_HOST}
SMTP Port: ${SMTP_PORT}
From: ${SMTP_USER}
To: ${BUSINESS_EMAIL}
        `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-family: Georgia, serif;">SOCIALE</h1>
              <p style="margin: 5px 0 0; font-size: 12px; letter-spacing: 2px;">FRAGRANCES</p>
            </div>
            <div style="padding: 30px 20px; text-align: center;">
              <div style="width: 60px; height: 60px; background: #E8F5E9; border-radius: 50%; margin: 0 auto 15px; line-height: 60px; font-size: 28px;">✅</div>
              <h2 style="margin: 0 0 20px;">Email System Working!</h2>
              <p>Your email configuration is correct. Order confirmations and notifications will be sent successfully.</p>
              <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; text-align: left; font-size: 12px; border-radius: 8px;">
                <strong>Configuration:</strong><br>
                SMTP Host: ${SMTP_HOST}<br>
                SMTP Port: ${SMTP_PORT}<br>
                From: ${SMTP_USER}<br>
                Business Email: ${BUSINESS_EMAIL}<br>
                Time: ${new Date().toLocaleString()}
              </div>
            </div>
          </div>
        `,
      });
      
      return NextResponse.json({ success: true, message: 'Test email sent to ' + BUSINESS_EMAIL });
    }

    // Validate order data for other email types
    if (!order || !order.orderId) {
      return NextResponse.json({ error: 'Order data required' }, { status: 400 });
    }

    const orderData = order as OrderData;
    const transporter = getTransporter();

    // Customer confirmation email
    if (type === 'customer-confirmation') {
      const email = emailTemplates.customerConfirmation(orderData);
      
      await transporter.sendMail({
        from: `"SOCIALE Fragrances" <${SMTP_USER}>`,
        to: orderData.customerEmail,
        subject: email.subject,
        html: email.html,
        text: email.text,
      });
      
      return NextResponse.json({ success: true, message: 'Customer confirmation sent' });
    }

    // Business notification email
    if (type === 'business-notification') {
      const email = emailTemplates.businessNotification(orderData);
      
      await transporter.sendMail({
        from: `"SOCIALE Orders" <${SMTP_USER}>`,
        to: BUSINESS_EMAIL,
        subject: email.subject,
        html: email.html,
        text: email.text,
      });
      
      return NextResponse.json({ success: true, message: 'Business notification sent' });
    }

    // Shipping confirmation email
    if (type === 'shipping-confirmation') {
      if (!orderData.trackingNumber) {
        return NextResponse.json({ error: 'Tracking number required' }, { status: 400 });
      }
      
      const email = emailTemplates.shippingConfirmation(orderData);
      
      await transporter.sendMail({
        from: `"SOCIALE Fragrances" <${SMTP_USER}>`,
        to: orderData.customerEmail,
        subject: email.subject,
        html: email.html,
        text: email.text,
      });
      
      return NextResponse.json({ success: true, message: 'Shipping confirmation sent' });
    }

    // Order delivered email
    if (type === 'order-delivered') {
      const email = emailTemplates.orderDelivered(orderData);
      
      await transporter.sendMail({
        from: `"SOCIALE Fragrances" <${SMTP_USER}>`,
        to: orderData.customerEmail,
        subject: email.subject,
        html: email.html,
        text: email.text,
      });
      
      return NextResponse.json({ success: true, message: 'Delivery notification sent' });
    }

    return NextResponse.json({ error: 'Invalid email type. Valid types: test, customer-confirmation, business-notification, shipping-confirmation, order-delivered' }, { status: 400 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorCode = (error as { code?: string })?.code;
    
    console.error('Email error:', {
      message: errorMessage,
      code: errorCode,
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // Provide user-friendly error messages for common SMTP issues
    let userMessage = 'Failed to send email';
    let hint = '';
    
    if (errorCode === 'EAUTH' || errorMessage.includes('Invalid login') || errorMessage.includes('authentication')) {
      userMessage = 'SMTP Authentication Failed';
      hint = 'Gmail requires an App Password (not your regular password). Generate one at: https://myaccount.google.com/apppasswords';
    } else if (errorCode === 'ESOCKET' || errorMessage.includes('ECONNREFUSED')) {
      userMessage = 'Cannot connect to SMTP server';
      hint = 'Check SMTP_HOST and SMTP_PORT settings';
    } else if (errorMessage.includes('self signed certificate')) {
      userMessage = 'SSL/TLS certificate error';
      hint = 'Try setting SMTP_PORT=465 for SSL';
    } else if (errorMessage.includes('SMTP_PASS')) {
      userMessage = 'SMTP password not configured';
      hint = 'Add SMTP_PASS environment variable in Vercel';
    }
    
    return NextResponse.json({ 
      error: userMessage,
      hint: hint,
      details: errorMessage,
      code: errorCode,
    }, { status: 500 });
  }
}

// GET /api/email/send - Health check / status
export async function GET() {
  const configured = !!SMTP_PASS;
  
  return NextResponse.json({
    status: configured ? 'ready' : 'not_configured',
    smtp: {
      host: SMTP_HOST,
      port: SMTP_PORT,
      user: SMTP_USER,
      passwordSet: configured,
    },
    businessEmail: BUSINESS_EMAIL,
    supportedTypes: [
      'test',
      'customer-confirmation',
      'business-notification',
      'shipping-confirmation',
      'order-delivered',
    ],
    message: configured 
      ? 'Email system ready' 
      : 'Add SMTP_PASS to environment variables to enable email sending',
  });
}
