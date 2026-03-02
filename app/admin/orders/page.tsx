'use client';

import { useState, useEffect } from 'react';

interface OrderItem {
  name: string;
  size: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress?: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
  };
  trackingNumber?: string;
}

export default function OrdersAdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [emailStatus, setEmailStatus] = useState('');

  // Mock orders for now - will be replaced with Stripe API integration
  useEffect(() => {
    if (authenticated) {
      loadOrders();
    }
  }, [authenticated]);

  const loadOrders = async () => {
    // In production, this would fetch from Stripe API
    // For now, show placeholder
    setOrders([]);
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'sociale2026') {
      setAuthenticated(true);
    } else {
      alert('Wrong password');
    }
  };

  const testEmail = async () => {
    setEmailStatus('Sending test email...');
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'test' }),
      });
      
      if (response.ok) {
        setEmailStatus('✅ Test email sent! Check your inbox.');
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      setEmailStatus('❌ Failed to send test email. Check SMTP settings.');
    }
    setTimeout(() => setEmailStatus(''), 5000);
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setSaveStatus('✅ Order status updated');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h1 className="text-2xl font-serif mb-2 text-center">Orders Admin</h1>
          <p className="text-gray-500 text-center mb-6">Manage orders and email notifications</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif mb-2">Orders Dashboard</h1>
            <p className="text-gray-600">Manage orders, track shipments, and send notifications</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={testEmail}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              📧 Test Email
            </button>
          </div>
        </div>

        {emailStatus && (
          <div className={`mb-6 p-4 rounded-lg ${emailStatus.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {emailStatus}
          </div>
        )}

        {saveStatus && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
            {saveStatus}
          </div>
        )}

        {/* Email Configuration */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-serif mb-4">Email Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
              <input
                type="text"
                value="smtp.gmail.com"
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
              <input
                type="text"
                value="587"
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
              <input
                type="text"
                value="Orders@socialefragrances.com"
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
              <input
                type="text"
                value="alex@socialefragrances.com"
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          </div>
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> To complete email setup, add these environment variables in Vercel:
            </p>
            <code className="block mt-2 text-xs bg-gray-100 p-2 rounded">
              SMTP_USER=Orders@socialefragrances.com<br/>
              SMTP_PASS=your-app-password<br/>
              BUSINESS_EMAIL=alex@socialefragrances.com
            </code>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium">Recent Orders</h2>
            <p className="text-sm text-gray-500 mt-1">
              Orders will appear here when Stripe webhook is configured
            </p>
          </div>
          
          {orders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-lg font-medium mb-2">No orders yet</h3>
              <p className="max-w-md mx-auto">
                Orders will automatically appear here when customers complete checkout. 
                Make sure to configure your Stripe webhook to enable order tracking.
              </p>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-lg mx-auto text-left">
                <h4 className="font-medium mb-2">To enable order tracking:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Go to Stripe Dashboard → Developers → Webhooks</li>
                  <li>Add endpoint: https://socialefragrances.com/api/webhooks/stripe</li>
                  <li>Select events: checkout.session.completed</li>
                  <li>Add STRIPE_WEBHOOK_SECRET to Vercel env vars</li>
                </ol>
              </div>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium">#{order.id}</div>
                      <div className="text-sm text-gray-500">{order.items.length} items</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-serif">Order #{selectedOrder.id}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-medium mb-2">Customer</h3>
                  <p>{selectedOrder.customerName}</p>
                  <p className="text-gray-500">{selectedOrder.customerEmail}</p>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-medium mb-2">Items</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-2">
                        <span>{item.name} ({item.size}) x{item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 font-medium flex justify-between">
                      <span>Total</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping */}
                {selectedOrder.shippingAddress && (
                  <div>
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <p className="text-gray-600">
                      {selectedOrder.shippingAddress.name}<br/>
                      {selectedOrder.shippingAddress.line1}<br/>
                      {selectedOrder.shippingAddress.line2 && <>{selectedOrder.shippingAddress.line2}<br/></>}
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postal_code}
                    </p>
                  </div>
                )}

                {/* Status Update */}
                <div>
                  <h3 className="font-medium mb-2">Update Status</h3>
                  <div className="flex gap-2 flex-wrap">
                    {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder.id, status)}
                        className={`px-4 py-2 rounded-lg text-sm capitalize ${
                          selectedOrder.status === status
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tracking */}
                <div>
                  <h3 className="font-medium mb-2">Tracking Number</h3>
                  <input
                    type="text"
                    placeholder="Enter tracking number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}