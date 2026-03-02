import { NextRequest, NextResponse } from 'next/server';
import { 
  getOrders, 
  getOrderById, 
  updateOrder, 
  updateOrderStatus,
  addTrackingInfo,
  searchOrders,
  getOrdersStats,
  Order,
  OrderStatus,
} from '@/lib/orders-db';
import nodemailer from 'nodemailer';
import { 
  emailTemplates, 
  OrderData 
} from '@/lib/email-templates';
import { markEmailSent } from '@/lib/orders-db';

// Email configuration
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || 'info@socialefragrances.com';
const SMTP_PASS = process.env.SMTP_PASS || '';
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || 'alex@socialefragrances.com';

// Create transporter
const getTransporter = () => nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

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

// GET /api/orders - Get all orders or search
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const status = searchParams.get('status') as OrderStatus | null;
    const orderId = searchParams.get('id');
    const stats = searchParams.get('stats');

    // Get stats
    if (stats === 'true') {
      const orderStats = await getOrdersStats();
      return NextResponse.json(orderStats);
    }

    // Get single order by ID
    if (orderId) {
      const order = await getOrderById(orderId);
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json(order);
    }

    // Search orders
    if (query) {
      const orders = await searchOrders(query);
      return NextResponse.json({ orders });
    }

    // Get all orders (optionally filtered by status)
    let orders = await getOrders();
    
    if (status) {
      orders = orders.filter(o => o.status === status);
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch orders',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}

// PUT /api/orders - Update an order
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, action, ...data } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const existingOrder = await getOrderById(orderId);
    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    let updatedOrder: Order | null = null;
    let emailSent = false;

    switch (action) {
      case 'update-status': {
        const { status } = data as { status: OrderStatus };
        if (!status) {
          return NextResponse.json({ error: 'Status required' }, { status: 400 });
        }
        updatedOrder = await updateOrderStatus(orderId, status);
        break;
      }

      case 'add-tracking': {
        const { trackingNumber, trackingUrl } = data;
        if (!trackingNumber) {
          return NextResponse.json({ error: 'Tracking number required' }, { status: 400 });
        }
        updatedOrder = await addTrackingInfo(orderId, trackingNumber, trackingUrl);
        break;
      }

      case 'send-shipping-email': {
        const { trackingNumber, trackingUrl } = data;
        
        // Update tracking info first
        updatedOrder = await addTrackingInfo(
          orderId, 
          trackingNumber || existingOrder.trackingNumber || '', 
          trackingUrl || existingOrder.trackingUrl
        );
        
        if (updatedOrder) {
          // Send shipping confirmation email
          try {
            const transporter = getTransporter();
            const emailData = orderToEmailData(updatedOrder);
            const email = emailTemplates.shippingConfirmation(emailData);
            
            await transporter.sendMail({
              from: `"SOCIALE Fragrances" <${SMTP_USER}>`,
              to: updatedOrder.customerEmail,
              subject: email.subject,
              html: email.html,
              text: email.text,
            });
            
            await markEmailSent(orderId, 'shipping');
            emailSent = true;
          } catch (emailError) {
            console.error('Failed to send shipping email:', emailError);
          }
        }
        break;
      }

      case 'send-delivered-email': {
        updatedOrder = await updateOrderStatus(orderId, 'delivered');
        
        if (updatedOrder) {
          // Send delivered notification email
          try {
            const transporter = getTransporter();
            const emailData = orderToEmailData(updatedOrder);
            const email = emailTemplates.orderDelivered(emailData);
            
            await transporter.sendMail({
              from: `"SOCIALE Fragrances" <${SMTP_USER}>`,
              to: updatedOrder.customerEmail,
              subject: email.subject,
              html: email.html,
              text: email.text,
            });
            
            await markEmailSent(orderId, 'delivered');
            emailSent = true;
          } catch (emailError) {
            console.error('Failed to send delivered email:', emailError);
          }
        }
        break;
      }

      case 'update-notes': {
        const { notes } = data;
        updatedOrder = await updateOrder(orderId, { notes });
        break;
      }

      default: {
        // General update
        updatedOrder = await updateOrder(orderId, data);
      }
    }

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      order: updatedOrder,
      emailSent,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ 
      error: 'Failed to update order',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
