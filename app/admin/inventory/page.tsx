'use client';

import { useState, useEffect } from 'react';

interface Size {
  name: string;
  size?: string;
  price: number;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  collection?: string;
  sizes?: Size[];
}

export default function InventoryPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('');

  // Load products from API
  useEffect(() => {
    if (authenticated) {
      fetchProducts();
    }
  }, [authenticated]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      // Filter out gift cards and subscriptions for inventory management
      const inventoryProducts = data.products.filter((p: Product) => 
        p.collection !== 'gift' && p.collection !== 'subscription'
      );
      setProducts(inventoryProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setSaveStatus('Error loading products');
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert('Wrong password');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditedProduct({ ...product });
  };

  const handleSave = async () => {
    if (!editedProduct) return;
    
    setSaveStatus('Saving...');
    
    try {
      // Save to server API (updates GitHub)
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-stock',
          product: {
            id: editedProduct.id,
            sizes: editedProduct.sizes,
          },
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save');
      }
      
      const result = await response.json();
      
      // Update local state
      const updated = products.map(p => p.id === editedProduct.id ? result.products.find((rp: Product) => rp.id === p.id) || p : p);
      setProducts(updated);
      
      setEditingId(null);
      setEditedProduct(null);
      setSaveStatus('✅ Saved! Vercel will redeploy in ~2 minutes.');
      setTimeout(() => setSaveStatus(''), 5000);
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('❌ Error saving - try again');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedProduct(null);
  };

  const updateSizeStock = (sizeIndex: number, newStock: number) => {
    if (!editedProduct || !editedProduct.sizes) return;
    const updatedSizes = [...editedProduct.sizes];
    updatedSizes[sizeIndex] = { ...updatedSizes[sizeIndex], stock: newStock };
    setEditedProduct({ ...editedProduct, sizes: updatedSizes });
  };

  const getTotalStock = (product: Product) => {
    if (product.sizes) {
      return product.sizes.reduce((sum, size) => sum + size.stock, 0);
    }
    return product.stock;
  };

  const getLowStockProducts = () => {
    return products.filter(p => getTotalStock(p) < 3 && getTotalStock(p) > 0);
  };

  const getOutOfStockProducts = () => {
    return products.filter(p => getTotalStock(p) === 0);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h1 className="text-2xl font-serif mb-6 text-center">Inventory Management</h1>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif mb-2">Inventory Dashboard</h1>
          <p className="text-gray-600">Manage your product stock levels. Changes save to GitHub and auto-deploy.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Products</h3>
            <p className="text-3xl font-bold">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Low Stock (&lt;3)</h3>
            <p className="text-3xl font-bold text-yellow-600">{getLowStockProducts().length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Out of Stock</h3>
            <p className="text-3xl font-bold text-red-600">{getOutOfStockProducts().length}</p>
          </div>
        </div>

        {saveStatus && (
          <div className={`mb-4 p-4 rounded-lg ${saveStatus.includes('✅') ? 'bg-green-50 text-green-700' : saveStatus.includes('❌') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
            {saveStatus}
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">${product.price}</div>
                  </td>
                  <td className="px-6 py-4">
                    {product.sizes ? (
                      <div className="space-y-1">
                        {product.sizes.map((size, idx) => (
                          <div key={idx} className="text-sm">
                            {size.name}: ${size.price}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Single size</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === product.id && editedProduct ? (
                      <div className="space-y-2">
                        {editedProduct.sizes?.map((size, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-sm">{size.name.split('(')[0]}:</span>
                            <input
                              type="number"
                              value={size.stock}
                              onChange={(e) => updateSizeStock(idx, parseInt(e.target.value) || 0)}
                              className="w-16 px-2 py-1 border border-gray-300 rounded"
                              min="0"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {product.sizes ? (
                          product.sizes.map((size, idx) => (
                            <div key={idx} className="text-sm">
                              {size.name.split('(')[0]}: <span className={size.stock === 0 ? 'text-red-600 font-medium' : size.stock < 3 ? 'text-yellow-600 font-medium' : ''}>{size.stock}</span>
                            </div>
                          ))
                        ) : (
                          <span>{product.stock}</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getTotalStock(product) === 0 ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Out of Stock
                      </span>
                    ) : getTotalStock(product) < 3 ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === product.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-2">How to Update Inventory</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Click "Edit" on any product</li>
            <li>Change the stock numbers for each size</li>
            <li>Set stock to 0 to show "Sold Out" on the website</li>
            <li>Click "Save" - changes commit to GitHub</li>
            <li>Vercel auto-redeploys (~2 minutes)</li>
            <li>New stock levels go live automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
}