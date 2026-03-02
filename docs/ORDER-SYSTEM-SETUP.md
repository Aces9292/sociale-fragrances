# SOCIALE Order Management System - Setup Guide

## Overview
Complete order management system with:
- ✅ Stripe webhook integration for automatic order capture
- ✅ Professional HTML email templates (SOCIALE branded)
- ✅ Full admin dashboard at `/admin/orders`
- ✅ Order status management workflow
- ✅ Shipping confirmation with tracking
- ✅ Delivered notification with review request

---

## Files Created/Modified

### New Files:
- `lib/email-templates.ts` - All 4 branded email templates
- `lib/orders-db.ts` - Orders database operations (JSON storage)
- `app/api/orders/route.ts` - Orders REST API
- `data/orders.json` - Orders database file

### Modified Files:
- `app/api/webhooks/stripe/route.ts` - Enhanced with order saving & email sending
- `app/api/email/send/route.ts` - Enhanced with all email types
- `app/admin/orders/page.tsx` - Full-featured dashboard

---

## Required Environment Variables

Add these to Vercel Dashboard → Settings → Environment Variables:

```
# Already set
STRIPE_SECRET_KEY=sk_live_51IK8wyAWsi4vfdyL...

# REQUIRED - Add these:
STRIPE_WEBHOOK_SECRET=whsec_...  # Get from Stripe webhook setup
SMTP_PASS=xxxx-xxxx-xxxx-xxxx   # Gmail App Password

# Already set (verify):
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@socialefragrances.com
BUSINESS_EMAIL=alex@socialefragrances.com
```

---

## Stripe Webhook Setup

1. Go to **Stripe Dashboard** → **Developers** → **Webhooks**

2. Click **Add endpoint**

3. Enter endpoint URL:
   ```
   https://socialefragrances.com/api/webhooks/stripe
   ```

4. Select events to listen:
   - `checkout.session.completed` (required)
   - `payment_intent.succeeded` (optional)
   - `charge.refunded` (optional)

5. Click **Add endpoint**

6. Copy the **Signing secret** (starts with `whsec_`)

7. Add to Vercel as `STRIPE_WEBHOOK_SECRET`

---

## Gmail App Password Setup

1. Go to https://myaccount.google.com/security

2. Enable **2-Step Verification** if not already enabled

3. Go to https://myaccount.google.com/apppasswords

4. Select app: **Mail**
   Select device: **Other** → Enter "SOCIALE Website"

5. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)

6. Add to Vercel as `SMTP_PASS` (remove spaces)

---

## Email Templates

### 1. Customer Order Confirmation
- Sent automatically when order is placed
- Shows order details, items, shipping address
- Professional SOCIALE branding

### 2. Business New Order Alert
- Sent to alex@socialefragrances.com
- Quick glance order summary
- Links to dashboard and Stripe

### 3. Shipping Confirmation
- Sent when you add tracking & click "Send Shipping Confirmation"
- Shows tracking number with optional tracking URL
- Estimated delivery message

### 4. Order Delivered
- Sent when you click "Mark as Delivered"
- Asks for review/rating
- Instagram CTA

---

## Admin Dashboard Features

Access at: `https://socialefragrances.com/admin/orders`
Password: `sociale2026`

### Stats Dashboard
- Total orders & revenue
- Today's orders & revenue
- Orders by status

### Order Management
- Search by order ID, customer name, or email
- Filter by status
- View full order details

### Order Actions
- Update status (Pending → Processing → Shipped → Delivered)
- Add tracking number
- Send shipping confirmation email
- Mark as delivered & notify customer
- Add internal notes
- View email history

---

## Order Status Flow

```
1. PENDING    → Order received, payment confirmed
2. PROCESSING → Order being prepared/packed
3. SHIPPED    → Package handed to carrier (send tracking email)
4. DELIVERED  → Package delivered (send follow-up email)
```

---

## API Endpoints

### GET /api/orders
- Get all orders: `/api/orders`
- Search: `/api/orders?q=search`
- Filter by status: `/api/orders?status=pending`
- Get stats: `/api/orders?stats=true`
- Get single order: `/api/orders?id=SOC-...`

### PUT /api/orders
```json
{
  "orderId": "SOC-...",
  "action": "update-status",
  "status": "processing"
}
```

Actions:
- `update-status` - Change order status
- `add-tracking` - Add tracking number
- `send-shipping-email` - Send shipping confirmation
- `send-delivered-email` - Mark delivered & notify
- `update-notes` - Save internal notes

### GET /api/email/send
Returns email system status and configuration

### POST /api/email/send
```json
{
  "type": "test"  // Sends test email to business
}
```

---

## Testing

1. **Test Email System:**
   - Go to `/admin/orders`
   - Click "Test Email"
   - Check alex@socialefragrances.com

2. **Test Stripe Webhook:**
   - Use Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
   - Or make test purchase

3. **Check Webhook Status:**
   - GET `/api/webhooks/stripe`
   - Returns: `{ status: "ok", smtpConfigured: true, webhookSecretConfigured: true }`

---

## Troubleshooting

### Emails not sending
- Check SMTP_PASS is set correctly in Vercel
- Verify Gmail App Password (not regular password)
- Check Vercel function logs for errors

### Orders not appearing
- Verify STRIPE_WEBHOOK_SECRET matches Stripe dashboard
- Check Stripe webhook delivery status
- Look for errors in Vercel function logs

### Webhook signature invalid
- Re-copy webhook secret from Stripe
- Make sure no extra spaces in environment variable

---

## Production Deployment

1. Push to GitHub (auto-deploys to Vercel)
2. Add environment variables in Vercel
3. Set up Stripe webhook pointing to production URL
4. Test with a real purchase (can refund after)

---

## Support

- Stripe Dashboard: https://dashboard.stripe.com
- Vercel Logs: https://vercel.com/[your-project]/functions
- Admin Dashboard: https://socialefragrances.com/admin/orders
