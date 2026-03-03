'use client';

import { useState, useEffect } from 'react';

interface Size {
  name: string;
  size: string;
  price: number;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  collection: string;
  price: number;
  stock: number;
  description: string;
  scentNotes: string[];
  burnTime: string;
  wax: string;
  sizes: Size[];
  featured?: boolean;
  onSale?: boolean;
  badge?: string;
  isBundle?: boolean;
  image?: string;
}

const COLLECTIONS = [
  { id: 'special', name: 'Limited Edition' },
  { id: 'pride', name: 'Pride Collection' },
  { id: 'boyfriend', name: 'Boyfriend Collection' },
];

export default function ProductsAdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form state for new/edit product
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    collection: 'special',
    price: 30,
    stock: 0,
    description: '',
    scentNotes: [],
    burnTime: '50-70 hours',
    wax: 'Vegan soy blend',
    sizes: [
      { name: 'Bedroom Size', size: '12 oz', price: 30, stock: 0 },
      { name: 'Living Room Size', size: '20 oz', price: 45, stock: 0 },
    ],
    featured: false,
  });

  useEffect(() => {
    if (authenticated) {
      fetchProducts();
    }
  }, [authenticated]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setProducts(data.products);
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Creating...');

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          product: formData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create');
      }

      const result = await response.json();
      setProducts(result.products);
      setIsCreating(false);
      resetForm();
      setSaveStatus('✅ Product created successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error: any) {
      setSaveStatus(`❌ Error: ${error.message}`);
      setTimeout(() => setSaveStatus(''), 5000);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSaveStatus('Updating...');

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          product: { ...formData, id: editingProduct.id },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update');
      }

      const result = await response.json();
      setProducts(result.products);
      setEditingProduct(null);
      resetForm();
      setSaveStatus('✅ Product updated successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('❌ Error updating product');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This cannot be undone.')) {
      return;
    }

    setSaveStatus('Deleting...');

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          product: { id: productId },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      const result = await response.json();
      setProducts(result.products);
      setSaveStatus('✅ Product deleted');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('❌ Error deleting product');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      collection: 'special',
      price: 30,
      stock: 0,
      description: '',
      scentNotes: [],
      burnTime: '50-70 hours',
      wax: 'Vegan soy blend',
      sizes: [
        { name: 'Bedroom Size', size: '12 oz', price: 30, stock: 0 },
        { name: 'Living Room Size', size: '20 oz', price: 45, stock: 0 },
      ],
      featured: false,
      onSale: false,
      badge: '',
      image: '',
    });
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      scentNotes: product.scentNotes || [],
    });
    setIsCreating(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingProduct(null);
    resetForm();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setIsCreating(false);
    resetForm();
  };

  const updateSize = (index: number, field: keyof Size, value: string | number) => {
    const newSizes = [...(formData.sizes || [])];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setFormData({ ...formData, sizes: newSizes });
  };

  const addSize = () => {
    const newSizes = [...(formData.sizes || [])];
    newSizes.push({ name: 'New Size', size: '12 oz', price: 30, stock: 0 });
    setFormData({ ...formData, sizes: newSizes });
  };

  const removeSize = (index: number) => {
    const newSizes = [...(formData.sizes || [])];
    newSizes.splice(index, 1);
    setFormData({ ...formData, sizes: newSizes });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h1 className="text-2xl font-serif mb-2 text-center">Products Admin</h1>
          <p className="text-gray-500 text-center mb-6">Manage your product catalog</p>
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
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif mb-2">Products Admin</h1>
            <p className="text-gray-600">Create, edit, and manage products</p>
          </div>
          <button
            onClick={startCreate}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            + Add New Product
          </button>
        </div>

        {saveStatus && (
          <div className={`mb-6 p-4 rounded-lg ${saveStatus.includes('✅') ? 'bg-green-50 text-green-700' : saveStatus.includes('❌') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
            {saveStatus}
          </div>
        )}

        {/* Create/Edit Form */}
        {(isCreating || editingProduct) && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-serif mb-6">
              {isCreating ? 'Create New Product' : 'Edit Product'}
            </h2>
            <form onSubmit={isCreating ? handleCreate : handleUpdate} className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="e.g., Millennial Ma"
                  required
                />
              </div>

              {/* Collection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Collection</label>
                <select
                  value={formData.collection}
                  onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  {COLLECTIONS.map((col) => (
                    <option key={col.id} value={col.id}>{col.name}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={4}
                  placeholder="Describe your product..."
                />
              </div>

              {/* Scent Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scent Notes (comma separated)</label>
                <input
                  type="text"
                  value={formData.scentNotes?.join(', ')}
                  onChange={(e) => setFormData({ ...formData, scentNotes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="e.g., Rose, Carnation, Lily of the Valley"
                />
              </div>

              {/* Product Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image URL</label>
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="https://socialefragrances.com/images/products/your-product.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the full URL to your product image. Recommended size: 1000x1000px
                </p>
                {formData.image && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Preview:</p>
                    <img 
                      src={formData.image} 
                      alt="Product preview" 
                      className="w-32 h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Sizes</label>
                <div className="space-y-4">
                  {formData.sizes?.map((size, index) => (
                    <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Size Name</label>
                        <input
                          type="text"
                          value={size.name}
                          onChange={(e) => updateSize(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded mb-3"
                          placeholder="e.g., Bedroom Size"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Size (oz)</label>
                            <input
                              type="text"
                              value={size.size}
                              onChange={(e) => updateSize(index, 'size', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                              placeholder="12 oz"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Price ($)</label>
                            <input
                              type="number"
                              value={size.price}
                              onChange={(e) => updateSize(index, 'price', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                              placeholder="30"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Stock</label>
                            <input
                              type="number"
                              value={size.stock}
                              onChange={(e) => updateSize(index, 'stock', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSize(index)}
                        className="text-red-600 hover:text-red-800 px-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addSize}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add another size
                </button>
              </div>

              {/* On Sale */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="onSale"
                  checked={formData.onSale}
                  onChange={(e) => setFormData({ ...formData, onSale: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="onSale" className="text-sm font-medium text-gray-700">
                  On Sale (shows sale banner)
                </label>
              </div>

              {/* Badge */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Badge</label>
                <input
                  type="text"
                  value={formData.badge || ''}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="e.g., NEW, SALE, LIMITED, Mother's Day 2026"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty for no badge. Examples: SALE, NEW, LIMITED EDITION</p>
              </div>

              {/* Featured */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Feature this product on homepage
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {isCreating ? 'Create Product' : 'Update Product'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collection</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.filter(p => !['gift', 'subscription'].includes(p.collection)).map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium">{product.name}</div>
                    {product.featured && (
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Featured</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {COLLECTIONS.find(c => c.id === product.collection)?.name || product.collection}
                  </td>
                  <td className="px-6 py-4">
                    ${product.price}
                    {product.sizes && product.sizes.length > 1 && (
                      <span className="text-sm text-gray-500"> - {product.sizes.length} sizes</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {product.stock === 0 ? (
                      <span className="text-red-600 font-medium">Out of Stock</span>
                    ) : product.stock < 3 ? (
                      <span className="text-yellow-600 font-medium">{product.stock} left</span>
                    ) : (
                      <span className="text-green-600">{product.stock}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(product)}
                        className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Total products: {products.filter(p => !['gift', 'subscription'].includes(p.collection)).length}</p>
        </div>
      </div>
    </div>
  );
}