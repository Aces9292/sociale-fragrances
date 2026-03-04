import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs/promises';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const discountCode = 'MILLENNIAL10';

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Your 10% Off Code 🕯️ Millennial Ma',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="text-align: center;">Welcome to Sociale 🦋</h1>
          <p>For the teens we were. And the moms we are.</p>
          
          <div style="background: linear-gradient(135deg, #EC4899, #8B5CF6); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0;">
            <div style="font-size: 14px;">YOUR DISCOUNT CODE:</div>
            <div style="font-size: 36px; font-weight: bold; letter-spacing: 3px; margin: 10px 0;">${discountCode}</div>
            <div style="font-size: 12px;">Valid for 30 days</div>
          </div>

          <p><strong>🌸 Millennial Ma</strong><br/>Rose • Carnation • Lily of the Valley</p>
          
          <p><strong>Two sizes:</strong></p>
          <ul>
            <li>Bedroom Size (12oz) - $32 → <strong>$28.80 with code</strong></li>
            <li>Living Room Size (20oz) - $49 → <strong>$44.10 with code</strong></li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://socialefragrances.com/shop/ma" style="background: #EC4899; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">Pre-Order for Mother's Day</a>
          </div>

          <p style="font-size: 12px; color: #666; text-align: center;">
            Ships for Mother's Day when you order by April 25th
          </p>
        </div>
      `,
    });

    // Store subscriber
    const subscriber = {
      email,
      timestamp: new Date().toISOString(),
      source: 'popup',
      discountCode,
    };

    try {
      await fs.appendFile('/tmp/sociale-subscribers.jsonl', JSON.stringify(subscriber) + '\n');
    } catch (e) {
      console.log('Warning: Could not save to file, but email sent');
    }

    return NextResponse.json({ success: true, discountCode });

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
