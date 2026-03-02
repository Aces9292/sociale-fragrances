// SOCIALE Fragrances - Email Templates
// Professional HTML email templates with brand styling

export interface OrderData {
  orderId: string;
  customerEmail: string;
  customerName: string;
  items: {
    name: string;
    size: string;
    price: number;
    quantity: number;
  }[];
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
    country?: string;
  };
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: string;
}

// Brand colors
const BRAND = {
  black: '#000000',
  white: '#FFFFFF',
  orange: '#E65C00',
  gray: '#666666',
  lightGray: '#F5F5F5',
  warmGray: '#F9F9F9',
};

// Common header
const emailHeader = `
  <div style="background: ${BRAND.black}; padding: 30px 20px; text-align: center;">
    <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; color: ${BRAND.white}; font-size: 32px; font-weight: normal; letter-spacing: 3px;">SOCIALE</h1>
    <p style="margin: 8px 0 0; font-size: 11px; letter-spacing: 4px; color: ${BRAND.white}; text-transform: uppercase;">Fragrances</p>
  </div>
`;

// Common footer
const emailFooter = `
  <div style="background: ${BRAND.lightGray}; padding: 30px 20px; text-align: center; font-size: 12px; color: ${BRAND.gray};">
    <p style="margin: 0 0 10px;">Questions? Reply to this email or contact us at <a href="mailto:info@socialefragrances.com" style="color: ${BRAND.orange};">info@socialefragrances.com</a></p>
    <p style="margin: 0;">© ${new Date().getFullYear()} SOCIALE Fragrances. All rights reserved.</p>
    <p style="margin: 15px 0 0;">
      <a href="https://socialefragrances.com" style="color: ${BRAND.gray}; text-decoration: none; margin: 0 10px;">Shop</a>
      <a href="https://instagram.com/socialefragrances" style="color: ${BRAND.gray}; text-decoration: none; margin: 0 10px;">Instagram</a>
    </p>
  </div>
`;

// Generate items table
function generateItemsTable(order: OrderData): string {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #eee; font-size: 14px;">
        <strong>${item.name}</strong><br>
        <span style="color: ${BRAND.gray}; font-size: 12px;">Size: ${item.size}</span>
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center; font-size: 14px;">${item.quantity}</td>
      <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right; font-size: 14px;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <table style="width: 100%; border-collapse: collapse; margin: 25px 0;">
      <thead>
        <tr style="background: ${BRAND.lightGray};">
          <th style="padding: 12px 15px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Product</th>
          <th style="padding: 12px 15px; text-align: center; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Qty</th>
          <th style="padding: 12px 15px; text-align: right; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding: 10px 15px; text-align: right; font-size: 14px;">Subtotal:</td>
          <td style="padding: 10px 15px; text-align: right; font-size: 14px;">$${order.subtotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 10px 15px; text-align: right; font-size: 14px;">Shipping:</td>
          <td style="padding: 10px 15px; text-align: right; font-size: 14px;">${order.shipping === 0 ? 'FREE' : '$' + order.shipping.toFixed(2)}</td>
        </tr>
        <tr style="background: ${BRAND.lightGray};">
          <td colspan="2" style="padding: 15px; text-align: right; font-size: 16px; font-weight: bold;">Total:</td>
          <td style="padding: 15px; text-align: right; font-size: 16px; font-weight: bold;">$${order.total.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>
  `;
}

// Generate shipping address block
function generateShippingBlock(order: OrderData): string {
  return `
    <div style="background: ${BRAND.warmGray}; padding: 20px; margin: 20px 0; border-left: 4px solid ${BRAND.orange};">
      <h3 style="margin: 0 0 10px; font-family: Georgia, serif; font-size: 16px; font-weight: normal;">Shipping Address</h3>
      <p style="margin: 0; color: ${BRAND.gray}; font-size: 14px; line-height: 1.6;">
        ${order.shippingAddress.name}<br>
        ${order.shippingAddress.line1}<br>
        ${order.shippingAddress.line2 ? order.shippingAddress.line2 + '<br>' : ''}
        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postal_code}
        ${order.shippingAddress.country && order.shippingAddress.country !== 'US' ? '<br>' + order.shippingAddress.country : ''}
      </p>
    </div>
  `;
}

// 1. CUSTOMER ORDER CONFIRMATION
export function customerOrderConfirmation(order: OrderData): { subject: string; html: string; text: string } {
  const subject = `Order Confirmed! #${order.orderId}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background: ${BRAND.white};">
        ${emailHeader}
        
        <div style="padding: 40px 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 60px; height: 60px; background: #E8F5E9; border-radius: 50%; margin: 0 auto 15px; line-height: 60px; font-size: 28px;">✓</div>
            <h2 style="margin: 0; font-family: Georgia, serif; font-size: 24px; font-weight: normal;">Thank You for Your Order!</h2>
            <p style="margin: 10px 0 0; color: ${BRAND.gray};">Order #${order.orderId}</p>
          </div>
          
          <p style="font-size: 15px; line-height: 1.7; color: #333;">
            Hi ${order.customerName.split(' ')[0]},<br><br>
            We've received your order and are preparing it with care. You'll receive a shipping confirmation email with tracking information once your order is on its way.
          </p>
          
          ${generateItemsTable(order)}
          ${generateShippingBlock(order)}
          
          <div style="background: #FFF8E1; padding: 20px; margin: 25px 0; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #F57C00;">
              <strong>What's Next?</strong><br>
              We'll send you a shipping confirmation with tracking within 1-2 business days.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://socialefragrances.com" style="display: inline-block; background: ${BRAND.black}; color: ${BRAND.white}; padding: 14px 40px; text-decoration: none; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
              Continue Shopping
            </a>
          </div>
        </div>
        
        ${emailFooter}
      </div>
    </body>
    </html>
  `;

  const text = `
SOCIALE Fragrances - Order Confirmation

Thank you for your order, ${order.customerName}!

Order #: ${order.orderId}
Date: ${new Date(order.createdAt).toLocaleDateString()}

ITEMS:
${order.items.map(item => `- ${item.name} (${item.size}) x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Subtotal: $${order.subtotal.toFixed(2)}
Shipping: ${order.shipping === 0 ? 'FREE' : '$' + order.shipping.toFixed(2)}
Total: $${order.total.toFixed(2)}

SHIPPING ADDRESS:
${order.shippingAddress.name}
${order.shippingAddress.line1}
${order.shippingAddress.line2 || ''}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postal_code}

We'll send you a shipping confirmation with tracking within 1-2 business days.

Questions? Contact us at info@socialefragrances.com

© ${new Date().getFullYear()} SOCIALE Fragrances
  `;

  return { subject, html, text };
}

// 2. BUSINESS NEW ORDER NOTIFICATION
export function businessOrderNotification(order: OrderData): { subject: string; html: string; text: string } {
  const subject = `🎉 NEW ORDER #${order.orderId} - $${order.total.toFixed(2)}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background: ${BRAND.white}; border: 3px solid ${BRAND.black};">
        <div style="background: linear-gradient(135deg, ${BRAND.black} 0%, #333 100%); padding: 25px; text-align: center;">
          <h1 style="margin: 0; color: ${BRAND.white}; font-size: 24px;">🎉 NEW ORDER!</h1>
          <p style="margin: 10px 0 0; color: ${BRAND.orange}; font-size: 28px; font-weight: bold;">$${order.total.toFixed(2)}</p>
        </div>
        
        <div style="padding: 30px;">
          <div style="background: ${BRAND.lightGray}; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <table style="width: 100%;">
              <tr>
                <td style="font-size: 13px; color: ${BRAND.gray};">Order #</td>
                <td style="font-size: 15px; font-weight: bold; text-align: right;">${order.orderId}</td>
              </tr>
              <tr>
                <td style="font-size: 13px; color: ${BRAND.gray}; padding-top: 10px;">Date</td>
                <td style="font-size: 15px; text-align: right; padding-top: 10px;">${new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <h3 style="margin: 0 0 15px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: ${BRAND.gray};">Customer</h3>
          <p style="margin: 0 0 25px; font-size: 15px;">
            <strong>${order.customerName}</strong><br>
            <a href="mailto:${order.customerEmail}" style="color: ${BRAND.orange};">${order.customerEmail}</a>
          </p>
          
          <h3 style="margin: 0 0 15px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: ${BRAND.gray};">Items Ordered</h3>
          <div style="background: ${BRAND.warmGray}; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
            ${order.items.map(item => `
              <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <strong>${item.name}</strong> - ${item.size}<br>
                <span style="color: ${BRAND.gray};">Qty: ${item.quantity} × $${item.price.toFixed(2)} = <strong>$${(item.price * item.quantity).toFixed(2)}</strong></span>
              </div>
            `).join('')}
          </div>
          
          ${generateShippingBlock(order)}
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://socialefragrances.com/admin/orders" style="display: inline-block; background: ${BRAND.black}; color: ${BRAND.white}; padding: 14px 30px; text-decoration: none; font-size: 14px; margin-right: 10px;">
              View in Dashboard
            </a>
            <a href="https://dashboard.stripe.com/payments" style="display: inline-block; background: ${BRAND.orange}; color: ${BRAND.white}; padding: 14px 30px; text-decoration: none; font-size: 14px;">
              Stripe Dashboard
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
NEW ORDER RECEIVED!

Order #: ${order.orderId}
Total: $${order.total.toFixed(2)}
Date: ${new Date(order.createdAt).toLocaleString()}

CUSTOMER:
${order.customerName}
${order.customerEmail}

ITEMS:
${order.items.map(item => `- ${item.name} (${item.size}) x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

SHIPPING ADDRESS:
${order.shippingAddress.name}
${order.shippingAddress.line1}
${order.shippingAddress.line2 || ''}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postal_code}

View order: https://socialefragrances.com/admin/orders
Stripe: https://dashboard.stripe.com/payments
  `;

  return { subject, html, text };
}

// 3. SHIPPING CONFIRMATION
export function shippingConfirmation(order: OrderData): { subject: string; html: string; text: string } {
  const subject = `Your SOCIALE Order is On Its Way! 📦`;
  
  const trackingButton = order.trackingUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${order.trackingUrl}" style="display: inline-block; background: ${BRAND.orange}; color: ${BRAND.white}; padding: 16px 50px; text-decoration: none; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; border-radius: 4px;">
        Track Your Package
      </a>
    </div>
  ` : '';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background: ${BRAND.white};">
        ${emailHeader}
        
        <div style="padding: 40px 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 60px; height: 60px; background: #E3F2FD; border-radius: 50%; margin: 0 auto 15px; line-height: 60px; font-size: 28px;">📦</div>
            <h2 style="margin: 0; font-family: Georgia, serif; font-size: 24px; font-weight: normal;">Your Order Has Shipped!</h2>
            <p style="margin: 10px 0 0; color: ${BRAND.gray};">Order #${order.orderId}</p>
          </div>
          
          <p style="font-size: 15px; line-height: 1.7; color: #333;">
            Great news, ${order.customerName.split(' ')[0]}! Your SOCIALE order is on its way to you.
          </p>
          
          ${order.trackingNumber ? `
            <div style="background: ${BRAND.lightGray}; padding: 25px; margin: 25px 0; text-align: center; border-radius: 8px;">
              <p style="margin: 0 0 5px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: ${BRAND.gray};">Tracking Number</p>
              <p style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 2px;">${order.trackingNumber}</p>
            </div>
          ` : ''}
          
          ${trackingButton}
          
          ${generateShippingBlock(order)}
          
          <h3 style="margin: 30px 0 15px; font-family: Georgia, serif; font-size: 18px; font-weight: normal;">Your Order</h3>
          ${order.items.map(item => `
            <div style="display: flex; padding: 15px 0; border-bottom: 1px solid #eee;">
              <div style="flex: 1;">
                <strong>${item.name}</strong><br>
                <span style="color: ${BRAND.gray}; font-size: 13px;">${item.size} × ${item.quantity}</span>
              </div>
              <div style="text-align: right;">
                $${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          `).join('')}
          
          <div style="background: #FFF8E1; padding: 20px; margin: 30px 0; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #F57C00; text-align: center;">
              <strong>Estimated Delivery:</strong> 3-5 business days
            </p>
          </div>
        </div>
        
        ${emailFooter}
      </div>
    </body>
    </html>
  `;

  const text = `
SOCIALE Fragrances - Shipping Confirmation

Great news, ${order.customerName}! Your order has shipped!

Order #: ${order.orderId}
${order.trackingNumber ? `Tracking Number: ${order.trackingNumber}` : ''}
${order.trackingUrl ? `Track your package: ${order.trackingUrl}` : ''}

ITEMS:
${order.items.map(item => `- ${item.name} (${item.size}) x${item.quantity}`).join('\n')}

SHIPPING TO:
${order.shippingAddress.name}
${order.shippingAddress.line1}
${order.shippingAddress.line2 || ''}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postal_code}

Estimated delivery: 3-5 business days

Questions? Contact us at info@socialefragrances.com

© ${new Date().getFullYear()} SOCIALE Fragrances
  `;

  return { subject, html, text };
}

// 4. ORDER DELIVERED
export function orderDelivered(order: OrderData): { subject: string; html: string; text: string } {
  const subject = `Your SOCIALE Order Has Been Delivered! ✨`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background: ${BRAND.white};">
        ${emailHeader}
        
        <div style="padding: 40px 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 60px; height: 60px; background: #E8F5E9; border-radius: 50%; margin: 0 auto 15px; line-height: 60px; font-size: 28px;">🎉</div>
            <h2 style="margin: 0; font-family: Georgia, serif; font-size: 24px; font-weight: normal;">Your Order Has Arrived!</h2>
            <p style="margin: 10px 0 0; color: ${BRAND.gray};">Order #${order.orderId}</p>
          </div>
          
          <p style="font-size: 15px; line-height: 1.7; color: #333; text-align: center;">
            Hi ${order.customerName.split(' ')[0]},<br><br>
            Your SOCIALE fragrance order has been delivered. We hope you love it!
          </p>
          
          <div style="background: linear-gradient(135deg, ${BRAND.lightGray} 0%, ${BRAND.warmGray} 100%); padding: 30px; margin: 30px 0; border-radius: 12px; text-align: center;">
            <p style="margin: 0 0 20px; font-size: 16px;">How was your experience?</p>
            <p style="margin: 0; font-size: 32px;">
              <a href="https://socialefragrances.com/review?order=${order.orderId}&rating=5" style="text-decoration: none; margin: 0 5px;">⭐</a>
              <a href="https://socialefragrances.com/review?order=${order.orderId}&rating=4" style="text-decoration: none; margin: 0 5px;">⭐</a>
              <a href="https://socialefragrances.com/review?order=${order.orderId}&rating=3" style="text-decoration: none; margin: 0 5px;">⭐</a>
              <a href="https://socialefragrances.com/review?order=${order.orderId}&rating=2" style="text-decoration: none; margin: 0 5px;">⭐</a>
              <a href="https://socialefragrances.com/review?order=${order.orderId}&rating=1" style="text-decoration: none; margin: 0 5px;">⭐</a>
            </p>
            <p style="margin: 15px 0 0; font-size: 13px; color: ${BRAND.gray};">Tap a star to rate your experience</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="margin: 0 0 20px; font-size: 15px;">Share your new fragrance on Instagram!</p>
            <a href="https://instagram.com/socialefragrances" style="display: inline-block; background: linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D); color: ${BRAND.white}; padding: 14px 30px; text-decoration: none; font-size: 14px; border-radius: 25px;">
              @socialefragrances
            </a>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 30px; margin-top: 30px; text-align: center;">
            <p style="margin: 0 0 20px; font-size: 16px; font-family: Georgia, serif;">Ready for your next scent?</p>
            <a href="https://socialefragrances.com" style="display: inline-block; background: ${BRAND.black}; color: ${BRAND.white}; padding: 14px 40px; text-decoration: none; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
              Shop Now
            </a>
          </div>
        </div>
        
        ${emailFooter}
      </div>
    </body>
    </html>
  `;

  const text = `
SOCIALE Fragrances - Order Delivered!

Hi ${order.customerName},

Your SOCIALE fragrance order has been delivered! 🎉

Order #: ${order.orderId}

We hope you love your new fragrance. If you have a moment, we'd love to hear your feedback!

Share your experience on Instagram: @socialefragrances

Questions or concerns? Contact us at info@socialefragrances.com

Thank you for choosing SOCIALE!

© ${new Date().getFullYear()} SOCIALE Fragrances
  `;

  return { subject, html, text };
}

// Export all templates
export const emailTemplates = {
  customerConfirmation: customerOrderConfirmation,
  businessNotification: businessOrderNotification,
  shippingConfirmation: shippingConfirmation,
  orderDelivered: orderDelivered,
};
