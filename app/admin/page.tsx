'use client';

import { useState } from 'react';

interface SyncedProduct {
  id: string;
  name: string;
  slug: string;
  collection: string;
  price: number;
  stock: number;
  sizes: Array<{ name: string; price: number; stock: number }>;
  images: string[];
}

interface SyncResponse {
  success: boolean;
  productCount?: number;
  products?: SyncedProduct[];
  syncedAt?: string;
  error?: string;
}

export default function AdminPage() {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<SyncResponse | null>(null);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  // Simple password protection
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'sociale2026') {
      setAuthenticated(true);
    } else {
      alert('Wrong password');
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/sync', { method: 'POST' });
      const data: SyncResponse = await response.json();
      setLastSync(data);
    } catch (error) {
      setLastSync({ success: false, error: String(error) });
    }
    setSyncing(false);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">SOCIALE Admin</h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">SOCIALE Admin Dashboard</h1>
        
        {/* Sync Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Squarespace Sync</h2>
          <p className="text-gray-600 mb-4">
            Pull latest product data, prices, and inventory from Squarespace.
          </p>
          
          <button
            onClick={handleSync}
            disabled={syncing}
            className={`px-6 py-3 rounded font-medium ${
              syncing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {syncing ? '⏳ Syncing...' : '🔄 Sync from Squarespace'}
          </button>

          {lastSync && (
            <div className={`mt-4 p-4 rounded ${lastSync.success ? 'bg-green-50' : 'bg-red-50'}`}>
              {lastSync.success ? (
                <>
                  <p className="font-medium text-green-800">
                    ✅ Sync complete! {lastSync.productCount} products synced.
                  </p>
                  <p className="text-sm text-green-600">
                    Last sync: {lastSync.syncedAt ? new Date(lastSync.syncedAt).toLocaleString() : 'Just now'}
                  </p>
                </>
              ) : (
                <p className="font-medium text-red-800">
                  ❌ Sync failed: {lastSync.error}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Products Grid */}
        {lastSync?.products && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Synced Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lastSync.products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{product.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{product.collection} collection</p>
                  <div className="space-y-1">
                    {product.sizes.map((size, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>{size.name}</span>
                        <span className="text-gray-600">${size.price} ({size.stock})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="https://maroon-sprout-936t.squarespace.com/config/commerce"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border rounded hover:bg-gray-50 text-center"
            >
              📦 Squarespace Products
            </a>
            <a
              href="https://maroon-sprout-936t.squarespace.com/config/orders"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border rounded hover:bg-gray-50 text-center"
            >
              🛒 Orders
            </a>
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border rounded hover:bg-gray-50 text-center"
            >
              🚀 Vercel Dashboard
            </a>
            <a
              href="https://github.com/Aces9292/sociale-fragrances"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border rounded hover:bg-gray-50 text-center"
            >
              💻 GitHub Repo
            </a>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">How to Update Products</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Go to <strong>Squarespace Products</strong> to update prices, inventory, or photos</li>
            <li>Come back here and click <strong>Sync from Squarespace</strong></li>
            <li>Changes will appear on the live site within 2-3 minutes</li>
          </ol>
          <p className="mt-4 text-sm text-gray-500">
            Note: For custom site design changes (homepage, layouts), contact your developer.
          </p>
        </div>
      </div>
    </div>
  );
}
