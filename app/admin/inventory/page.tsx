'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  sizes?: { name: string; price: number; stock: number }[];
}

const PRODUCTS: Product[] = [
  {
    id: 'ma',
    name: 'Millennial Ma',
    slug: 'ma',
    price: 30,
    stock: 2,
    sizes: [
      { name: 'Bedroom Size (12 oz)', price: 30, stock: 1 },
      { name: 'Living Room Size (20 oz)', price: 45, stock: 1 },
    ],
  },
  {
    id: 'fire-island',
    name: 'Fire Island',
    slug: 'fire-island',
    price: 30,
    stock: 2,
    sizes: [
      { name: 'Bedroom Size (12 oz)', price: 30, stock: 1 },
      { name: 'Living Room Size (20 oz)', price: 45, stock: 1 },
    ],
  },
  {
    id: 'palm-springs',
    name: 'Palm Springs',
    slug: 'palm-springs',
    price: 30,
    stock: 2,
    sizes: [
      { name: 'Bedroom Size (12 oz)', price: 30, stock: 1 },
      { name: 'Living Room Size (20 oz)', price: 45, stock: 1 },
    ],
  },
  {
    id: 'asbury-park',
    name: 'Asbury Park',
    slug: 'asbury-park',
    price: 30,
    stock: 2,
    sizes: [
      { name: 'Bedroom Size (12 oz)', price: 30, stock: 1 },
      { name: 'Living Room Size (20 oz)', price: 45, stock: 1 },
    ],
  },
  {
    id: 'provincetown',
    name: 'Provincetown',
    slug: 'provincetown',
    price: 30,
    stock: 2,
    sizes: [
      { name: 'Bedroom Size (12 oz)', price: 30, stock: 1 },
      { name: 'Living Room Size (20 oz)', price: 45, stock: 1 },
    ],
  },
  {
    id: 'hipster',
    name: 'Hipster',
    slug: 'hipster',
    price: 30,
    stock: 2,
    sizes: [
      { name: 'Bedroom Size (12 oz)', price: 30, stock: 1 },
      { name: 'Living Room Size (20 oz)', price: 45, stock: 1 },
    ],
  },
  {
    id: 'bro',
    name: 'Bro',
    slug: 'bro',
    price: 30,
    stock: 2,
    sizes: [
      { name: 'Bedroom Size (12 oz)', price: 30, stock: 1 },
      { name: 'Living Room Size (20 oz)', price: 45, stock: 1 },
    ],
  },
  {
    id: 'ivy-leaguer',
    name: 'Ivy Leaguer',
    slug: 'ivy-leaguer',
    price: 30,
    stock: 2,
    sizes: [
      { name: 'Bedroom Size (12 oz)', price: 30, stock: 1 },
      { name: 'Living Room Size (20 oz)', price: 45, stock: 1 },
    ],
  },
  {
    id: 'pride-collection-bundle',
    name: 'Pride Collection Bundle',
    slug: 'pride-collection-bundle',
    price: 110,
    stock: 2,
    sizes: [
      { name: 'Bedroom Size (12 oz each)', price: 110, stock: 1 },
      { name: 'Living Room Size (20 oz each)', price: 170, stock: 1 },
    ],
  },
  {
    id: 'boyfriend-bundle',
    name: 'Boyfriend Bundle',
    slug: 'boyfriend-bundle',
    price: 75,
    stock: 2,
    sizes: [
      { name: 'Bedroom Size (12 oz each)', price: 75, stock: 1 },
      { name: 'Living Room Size (20 oz each)', price: 120, stock: 1 },
    ],
  },
];

export default function InventoryPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sociale-inventory');
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load inventory:', e);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'sociale2026') {
      setAuthenticated(true);
    } else {
      alert('Wrong password');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditedProduct({ ...product });
  };

  const handleSave = () => {
    if (!editedProduct) return;
    
    const updated = products.map(p => p.id === editedProduct.id ? editedProduct : p);
    setProducts(updated);
    localStorage.setItem('sociale-inventory', JSON.stringify(updated));
    setEditingId(null);
    setEditedProduct(null);
    setSaveStatus('Saved!');
    setTimeout(() => setSaveStatus(''), 2000);
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif mb-2">Inventory Dashboard</h1>
          <p className="text-gray-600">Manage your product stock levels</p>
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
          <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
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
                              {size.name.split('(')[0]}: {size.stock}
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
          <h3 className="font-medium text-blue-900 mb-2">How to Use</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Click "Edit" to change stock quantities</li>
            <li>Set stock to 0 to mark as "Sold Out"</li>
            <li>Click "Save" to update (saves to browser)</li>
            <li>Changes are saved locally - clear browser cache will reset to defaults</li>
            <li>To sync with Squarespace: Update quantities there, then update here to match</li>
          </ul>
        </div>
      </div>
    </div>
  );
}