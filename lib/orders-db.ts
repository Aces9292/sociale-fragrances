// Orders Database - JSON file storage for orders
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  name: string;
  size: string;
  price: number;
  quantity: number;
  productId?: string;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
}

export interface Order {
  id: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  emailsSent: {
    confirmation?: string;
    businessNotification?: string;
    shipping?: string;
    delivered?: string;
  };
}

interface OrdersData {
  orders: Order[];
  lastUpdated: string;
}

// Ensure data directory exists
async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Read all orders from file
export async function getOrders(): Promise<Order[]> {
  await ensureDataDir();
  
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf-8');
    const parsed: OrdersData = JSON.parse(data);
    return parsed.orders || [];
  } catch (error) {
    // File doesn't exist or is corrupted, return empty array
    return [];
  }
}

// Save all orders to file
async function saveOrders(orders: Order[]): Promise<void> {
  await ensureDataDir();
  
  const data: OrdersData = {
    orders,
    lastUpdated: new Date().toISOString(),
  };
  
  await fs.writeFile(ORDERS_FILE, JSON.stringify(data, null, 2));
}

// Get a single order by ID
export async function getOrderById(orderId: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find(o => o.id === orderId) || null;
}

// Get order by Stripe session ID
export async function getOrderByStripeSession(sessionId: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find(o => o.stripeSessionId === sessionId) || null;
}

// Create a new order
export async function createOrder(orderData: Omit<Order, 'updatedAt' | 'emailsSent'>): Promise<Order> {
  const orders = await getOrders();
  
  const order: Order = {
    ...orderData,
    updatedAt: new Date().toISOString(),
    emailsSent: {},
  };
  
  orders.unshift(order); // Add to beginning (newest first)
  await saveOrders(orders);
  
  return order;
}

// Update an existing order
export async function updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
  const orders = await getOrders();
  const index = orders.findIndex(o => o.id === orderId);
  
  if (index === -1) {
    return null;
  }
  
  orders[index] = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  await saveOrders(orders);
  return orders[index];
}

// Update order status
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
  return updateOrder(orderId, { status });
}

// Add tracking info
export async function addTrackingInfo(
  orderId: string, 
  trackingNumber: string, 
  trackingUrl?: string
): Promise<Order | null> {
  return updateOrder(orderId, { 
    trackingNumber, 
    trackingUrl,
    status: 'shipped',
  });
}

// Mark email as sent
export async function markEmailSent(
  orderId: string, 
  emailType: keyof Order['emailsSent']
): Promise<Order | null> {
  const order = await getOrderById(orderId);
  if (!order) return null;
  
  return updateOrder(orderId, {
    emailsSent: {
      ...order.emailsSent,
      [emailType]: new Date().toISOString(),
    },
  });
}

// Delete an order (for cleanup/testing)
export async function deleteOrder(orderId: string): Promise<boolean> {
  const orders = await getOrders();
  const filteredOrders = orders.filter(o => o.id !== orderId);
  
  if (filteredOrders.length === orders.length) {
    return false; // Order not found
  }
  
  await saveOrders(filteredOrders);
  return true;
}

// Search orders
export async function searchOrders(query: string): Promise<Order[]> {
  const orders = await getOrders();
  const lowerQuery = query.toLowerCase();
  
  return orders.filter(order => 
    order.id.toLowerCase().includes(lowerQuery) ||
    order.customerEmail.toLowerCase().includes(lowerQuery) ||
    order.customerName.toLowerCase().includes(lowerQuery) ||
    order.items.some(item => item.name.toLowerCase().includes(lowerQuery))
  );
}

// Get orders by status
export async function getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
  const orders = await getOrders();
  return orders.filter(order => order.status === status);
}

// Get orders stats
export async function getOrdersStats(): Promise<{
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
  todayRevenue: number;
  todayOrders: number;
}> {
  const orders = await getOrders();
  const today = new Date().toISOString().split('T')[0];
  
  const todayOrders = orders.filter(o => o.createdAt.startsWith(today));
  
  return {
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
  };
}

// Generate order ID
export function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SOC-${timestamp}-${random}`;
}
