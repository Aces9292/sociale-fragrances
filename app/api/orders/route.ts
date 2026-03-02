import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

// GET /api/orders - Fetch orders from Stripe
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const stats = searchParams.get('stats');

    // Fetch recent checkout sessions from Stripe
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      expand: ['data.line_items', 'data.customer_details'],
    });

    // Convert Stripe sessions to order format
    const orders = sessions.data.map(session => {
      const lineItems = session.line_items?.data || [];
      
      return {
        id: session.id.replace('cs_live_', 'ORD-').replace('cs_test_', 'ORD-'),
        stripeSessionId: session.id,
        customerEmail: session.customer_details?.email || session.customer_email || '',
        customerName: session.customer_details?.name || '',
        items: lineItems.map(item => ({
          name: item.description || 'Unknown Product',
          size: (item.price?.product as any)?.metadata?.size || 'Standard',
          price: (item.amount_total || 0) / 100 / (item.quantity || 1),
          quantity: item.quantity || 1,
        })),
        subtotal: (session.amount_subtotal || 0) / 100,
        shipping: (session.shipping_cost?.amount_total || 0) / 100,
        total: (session.amount_total || 0) / 100,
        status: session.payment_status === 'paid' ? 'pending' : 'cancelled',
        shippingAddress: {
          name: (session as any).shipping_details?.name || session.customer_details?.name || '',
          line1: (session as any).shipping_details?.address?.line1 || session.customer_details?.address?.line1 || '',
          line2: (session as any).shipping_details?.address?.line2 || undefined,
          city: (session as any).shipping_details?.address?.city || session.customer_details?.address?.city || '',
          state: (session as any).shipping_details?.address?.state || session.customer_details?.address?.state || '',
          postal_code: (session as any).shipping_details?.address?.postal_code || session.customer_details?.address?.postal_code || '',
        },
        createdAt: new Date(session.created * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    // Get stats
    if (stats === 'true') {
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = orders.filter(o => o.createdAt.startsWith(today));
      
      return NextResponse.json({
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        totalRevenue: orders
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, o) => sum + o.total, 0),
        todayRevenue: todayOrders
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, o) => sum + o.total, 0),
        todayOrders: todayOrders.length,
      });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders from Stripe:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch orders',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}

// PUT /api/orders - Update order status (placeholder for future DB)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, action, ...data } = body;

    // For now, just return success - we'd need a real database for persistence
    return NextResponse.json({ 
      success: true, 
      message: 'Order updates require a database. Use Stripe Dashboard for now.',
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ 
      error: 'Failed to update order',
    }, { status: 500 });
  }
}