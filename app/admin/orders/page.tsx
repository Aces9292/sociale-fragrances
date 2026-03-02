'use client';

import { useState, useEffect, useCallback } from 'react';

interface OrderItem {
  name: string;
  size: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  stripeSessionId?: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
  };
  trackingNumber?: string;
  trackingUrl?: string;
  notes?: string;
  emailsSent?: {
    confirmation?: string;
    businessNotification?: string;
    shipping?: string;
    delivered?: string;
  };
}

interface Stats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
  todayRevenue: number;
  todayOrders: number;
}

export default function OrdersAdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingUrlInput, setTrackingUrlInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage({ text: '', type: '' }), 5000);
  };

  const loadOrders = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      
      const response = await fetch(`/api/orders?${params.toString()}`);
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      showMessage('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter]);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/orders?stats=true');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  useEffect(() => {
    if (authenticated) {
      loadOrders();
      loadStats();
    }
  }, [authenticated, loadOrders]);

  // Debounce search
  useEffect(() => {
    if (!authenticated) return;
    const timer = setTimeout(() => loadOrders(), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, authenticated, loadOrders]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'sociale2026') {
      setAuthenticated(true);
    } else {
      showMessage('Wrong password', 'error');
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId, 
          action: 'update-status', 
          status: newStatus 
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      
      const data = await response.json();
      setOrders(orders.map(o => o.id === orderId ? data.order : o));
      if (selectedOrder?.id === orderId) setSelectedOrder(data.order);
      showMessage(`Order status updated to ${newStatus}`, 'success');
      loadStats();
    } catch (error) {
      showMessage('Failed to update status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const sendShippingEmail = async (orderId: string) => {
    if (!trackingInput.trim()) {
      showMessage('Please enter a tracking number', 'error');
      return;
    }
    
    setActionLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId, 
          action: 'send-shipping-email',
          trackingNumber: trackingInput,
          trackingUrl: trackingUrlInput || undefined,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to send email');
      
      const data = await response.json();
      setOrders(orders.map(o => o.id === orderId ? data.order : o));
      if (selectedOrder?.id === orderId) setSelectedOrder(data.order);
      
      if (data.emailSent) {
        showMessage('Shipping confirmation sent!', 'success');
      } else {
        showMessage('Tracking updated but email failed - check SMTP settings', 'error');
      }
      
      setTrackingInput('');
      setTrackingUrlInput('');
    } catch (error) {
      showMessage('Failed to send shipping email', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const markDelivered = async (orderId: string) => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId, 
          action: 'send-delivered-email',
        }),
      });
      
      if (!response.ok) throw new Error('Failed to mark delivered');
      
      const data = await response.json();
      setOrders(orders.map(o => o.id === orderId ? data.order : o));
      if (selectedOrder?.id === orderId) setSelectedOrder(data.order);
      
      if (data.emailSent) {
        showMessage('Order marked delivered & customer notified!', 'success');
      } else {
        showMessage('Status updated but email failed', 'error');
      }
      loadStats();
    } catch (error) {
      showMessage('Failed to mark delivered', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const updateNotes = async (orderId: string) => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId, 
          action: 'update-notes',
          notes: notesInput,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update notes');
      
      const data = await response.json();
      setOrders(orders.map(o => o.id === orderId ? data.order : o));
      if (selectedOrder?.id === orderId) setSelectedOrder(data.order);
      showMessage('Notes saved', 'success');
    } catch (error) {
      showMessage('Failed to save notes', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const testEmail = async () => {
    setActionLoading(true);
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'test' }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showMessage('Test email sent! Check your inbox.', 'success');
      } else {
        // Show detailed error from API
        const errorMsg = data.hint 
          ? `${data.error}: ${data.hint}`
          : data.details || data.error || 'Failed to send';
        throw new Error(errorMsg);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send test email';
      showMessage(message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif mb-2">SOCIALE</h1>
            <p className="text-gray-500">Orders Dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter admin password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Login
            </button>
          </form>
          {statusMessage.text && (
            <div className={`mt-4 p-3 rounded-lg text-center ${
              statusMessage.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}>
              {statusMessage.text}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif">Orders Dashboard</h1>
            <p className="text-gray-600 text-sm md:text-base">Manage orders and send notifications</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={testEmail}
              disabled={actionLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
            >
              📧 Test Email
            </button>
            <button
              onClick={() => { loadOrders(); loadStats(); }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            statusMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {statusMessage.text}
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <p className="text-gray-500 text-sm">Today&apos;s Orders</p>
              <p className="text-2xl font-bold text-blue-600">{stats.todayOrders}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <p className="text-gray-500 text-sm">Today&apos;s Revenue</p>
              <p className="text-2xl font-bold text-orange-500">${stats.todayRevenue.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Status Summary */}
        {stats && (
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { key: 'pending', label: 'Pending', count: stats.pending, color: 'yellow' },
              { key: 'processing', label: 'Processing', count: stats.processing, color: 'blue' },
              { key: 'shipped', label: 'Shipped', count: stats.shipped, color: 'purple' },
              { key: 'delivered', label: 'Delivered', count: stats.delivered, color: 'green' },
              { key: 'cancelled', label: 'Cancelled', count: stats.cancelled, color: 'red' },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setStatusFilter(statusFilter === item.key ? 'all' : item.key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  statusFilter === item.key 
                    ? `bg-${item.color}-500 text-white` 
                    : `bg-${item.color}-100 text-${item.color}-800 hover:bg-${item.color}-200`
                }`}
              >
                {item.label}: {item.count}
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders by ID, customer name, or email..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-lg font-medium mb-2">No orders yet</h3>
              <p className="max-w-md mx-auto text-sm">
                Orders will automatically appear here when customers complete checkout via Stripe.
              </p>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-lg mx-auto text-left">
                <h4 className="font-medium mb-2 text-blue-900">Setup Checklist:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside text-blue-800">
                  <li>Go to Stripe Dashboard → Developers → Webhooks</li>
                  <li>Add endpoint: https://socialefragrances.com/api/webhooks/stripe</li>
                  <li>Select event: checkout.session.completed</li>
                  <li>Copy webhook signing secret</li>
                  <li>Add STRIPE_WEBHOOK_SECRET to Vercel env vars</li>
                  <li>Add SMTP_PASS (Gmail App Password) to Vercel</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Items</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="font-medium text-sm">#{order.id}</div>
                        {order.trackingNumber && (
                          <div className="text-xs text-purple-600">📦 {order.trackingNumber}</div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-sm">{order.customerName}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[150px]">{order.customerEmail}</div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="text-sm text-gray-600">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 hidden lg:table-cell">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setTrackingInput(order.trackingNumber || '');
                            setTrackingUrlInput(order.trackingUrl || '');
                            setNotesInput(order.notes || '');
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-serif">Order #{selectedOrder.id}</h2>
                  <p className="text-sm text-gray-500">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Current Status */}
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 text-sm font-semibold rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status.toUpperCase()}
                  </span>
                  {selectedOrder.trackingNumber && (
                    <span className="text-sm text-purple-600">
                      Tracking: {selectedOrder.trackingNumber}
                    </span>
                  )}
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-2 text-sm text-gray-500 uppercase">Customer</h3>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                  <a href={`mailto:${selectedOrder.customerEmail}`} className="text-blue-600 text-sm">
                    {selectedOrder.customerEmail}
                  </a>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-medium mb-3 text-sm text-gray-500 uppercase">Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-2 border-b last:border-0">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500 text-sm ml-2">({item.size})</span>
                          <span className="text-gray-400 text-sm ml-2">×{item.quantity}</span>
                        </div>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-3 pt-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{selectedOrder.shipping === 0 ? 'FREE' : `$${selectedOrder.shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2">
                      <span>Total</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-2 text-sm text-gray-500 uppercase">Ship To</h3>
                  <p className="text-gray-700">
                    {selectedOrder.shippingAddress.name}<br/>
                    {selectedOrder.shippingAddress.line1}<br/>
                    {selectedOrder.shippingAddress.line2 && <>{selectedOrder.shippingAddress.line2}<br/></>}
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postal_code}
                  </p>
                </div>

                {/* Status Actions */}
                <div>
                  <h3 className="font-medium mb-3 text-sm text-gray-500 uppercase">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(selectedOrder.id, status)}
                        disabled={actionLoading || selectedOrder.status === status}
                        className={`px-4 py-2 rounded-lg text-sm capitalize transition-all disabled:opacity-50 ${
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

                {/* Shipping / Tracking */}
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-3 text-sm text-gray-500 uppercase">Shipping & Tracking</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      placeholder="Tracking number (e.g., 1Z999AA10123456784)"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      value={trackingUrlInput}
                      onChange={(e) => setTrackingUrlInput(e.target.value)}
                      placeholder="Tracking URL (optional)"
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <button
                      onClick={() => sendShippingEmail(selectedOrder.id)}
                      disabled={actionLoading || !trackingInput.trim()}
                      className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
                    >
                      📦 Send Shipping Confirmation Email
                    </button>
                  </div>
                </div>

                {/* Mark Delivered */}
                {selectedOrder.status === 'shipped' && (
                  <div className="border-t pt-6">
                    <button
                      onClick={() => markDelivered(selectedOrder.id)}
                      disabled={actionLoading}
                      className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                    >
                      ✅ Mark as Delivered & Notify Customer
                    </button>
                  </div>
                )}

                {/* Notes */}
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-3 text-sm text-gray-500 uppercase">Internal Notes</h3>
                  <textarea
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="Add notes about this order..."
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg resize-none"
                  />
                  <button
                    onClick={() => updateNotes(selectedOrder.id)}
                    disabled={actionLoading}
                    className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    Save Notes
                  </button>
                </div>

                {/* Email History */}
                {selectedOrder.emailsSent && Object.keys(selectedOrder.emailsSent).length > 0 && (
                  <div className="border-t pt-6">
                    <h3 className="font-medium mb-3 text-sm text-gray-500 uppercase">Emails Sent</h3>
                    <div className="space-y-1 text-sm">
                      {selectedOrder.emailsSent.confirmation && (
                        <p className="text-green-600">✓ Confirmation: {formatDate(selectedOrder.emailsSent.confirmation)}</p>
                      )}
                      {selectedOrder.emailsSent.businessNotification && (
                        <p className="text-green-600">✓ Business Alert: {formatDate(selectedOrder.emailsSent.businessNotification)}</p>
                      )}
                      {selectedOrder.emailsSent.shipping && (
                        <p className="text-green-600">✓ Shipping: {formatDate(selectedOrder.emailsSent.shipping)}</p>
                      )}
                      {selectedOrder.emailsSent.delivered && (
                        <p className="text-green-600">✓ Delivered: {formatDate(selectedOrder.emailsSent.delivered)}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
