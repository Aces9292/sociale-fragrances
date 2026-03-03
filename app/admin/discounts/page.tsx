'use client';

import { useState, useEffect } from 'react';
import { DISCOUNT_CODES, DiscountCode, setDiscountCodes } from '@/lib/discounts';

interface AdminDiscountCode extends DiscountCode {
  id: string;
}

export default function AdminDiscountsPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [discounts, setDiscounts] = useState<AdminDiscountCode[]>([]);
  const [saveStatus, setSaveStatus] = useState('');
  const [editingCode, setEditingCode] = useState<string | null>(null);
  
  // Form state for new/edit
  const [formData, setFormData] = useState<Partial<AdminDiscountCode>>({
    code: '',
    type: 'percentage',
    value: 0,
    minOrder: undefined,
    maxDiscount: undefined,
    expiresAt: undefined,
    usageLimit: undefined,
    active: true,
    description: ''
  });

  useEffect(() => {
    if (authenticated) {
      fetchDiscounts();
    }
  }, [authenticated]);

  const fetchDiscounts = async () => {
    try {
      const response = await fetch('/api/admin/discounts');
      const data = await response.json();
      if (data.discounts) {
        const codesWithIds = data.discounts.map((d: DiscountCode, index: number) => ({
          ...d,
          id: `discount-${index}`
        }));
        setDiscounts(codesWithIds);
      }
    } catch (error) {
      console.error('Failed to fetch discounts:', error);
      // Fallback to local data
      const codesWithIds = DISCOUNT_CODES.map((d, index) => ({
        ...d,
        id: `discount-${index}`
      }));
      setDiscounts(codesWithIds);
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

  const toggleActive = async (id: string) => {
    const code = discounts.find(d => d.id === id);
    if (!code) return;
    
    const newActive = !code.active;
    
    // Optimistically update UI
    setDiscounts(prev => prev.map(d => 
      d.id === id ? { ...d, active: newActive } : d
    ));
    
    // Persist to GitHub
    try {
      const response = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle',
          code: code.code,
          active: newActive
        })
      });
      
      if (response.ok) {
        setSaveStatus(`✅ ${code.code} ${newActive ? 'activated' : 'deactivated'} and saved`);
        // Update local cache
        const newCodes = discounts.map(d => 
          d.id === id ? { ...d, active: newActive } : d
        );
        setDiscountCodes(newCodes.map(({ id, ...rest }) => rest));
      } else {
        setSaveStatus('❌ Failed to save to GitHub');
      }
    } catch (error) {
      setSaveStatus('❌ Network error - will retry on save');
    }
    
    setTimeout(() => setSaveStatus(''), 3000);
  };



  const handleDelete = async (id: string) => {
    const code = discounts.find(d => d.id === id);
    if (!code) return;
    
    if (confirm('Are you sure you want to delete this code?')) {
      try {
        const response = await fetch('/api/admin/discounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'delete',
            code: code.code
          })
        });
        
        if (response.ok) {
          setDiscounts(prev => prev.filter(d => d.id !== id));
          setSaveStatus(`✅ ${code.code} deleted from GitHub`);
        } else {
          setSaveStatus('❌ Failed to delete');
        }
      } catch (error) {
        setSaveStatus('❌ Network error');
      }
      
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleCreate = async () => {
    if (!formData.code || !formData.value) {
      alert('Code and value are required');
      return;
    }
    
    const newCode: DiscountCode = {
      code: formData.code.toUpperCase().trim(),
      type: formData.type as 'percentage' | 'fixed',
      value: Number(formData.value),
      minOrder: formData.minOrder ? Number(formData.minOrder) : undefined,
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
      expiresAt: formData.expiresAt || undefined,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
      active: formData.active ?? true,
      usageCount: 0,
      description: formData.description || ''
    };
    
    // Persist to GitHub
    try {
      const response = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          discounts: newCode
        })
      });
      
      if (response.ok) {
        // Update local state
        setDiscounts(prev => [...prev, { ...newCode, id: `discount-${Date.now()}` }]);
        setFormData({
          code: '',
          type: 'percentage',
          value: 0,
          active: true,
          description: ''
        });
        setSaveStatus(`✅ ${newCode.code} created and saved to GitHub`);
      } else {
        setSaveStatus('❌ Failed to save to GitHub');
      }
    } catch (error) {
      setSaveStatus('❌ Network error');
    }
    
    setTimeout(() => setSaveStatus(''), 3000);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h1 className="text-2xl font-serif mb-2 text-center">Discount Codes Admin</h1>
          <p className="text-gray-500 text-center mb-6">Manage promotional codes</p>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif mb-2">Discount Codes</h1>
            <p className="text-gray-600">Create, edit, and activate promotional codes (auto-saves to GitHub)</p>
          </div>
        </div>

        {saveStatus && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
            {saveStatus}
          </div>
        )}

        {/* Create New Code */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-medium mb-4">Create New Discount Code</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="WELCOME15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as 'percentage' | 'fixed'})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder={formData.type === 'percentage' ? '15' : '10'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Order ($)</label>
              <input
                type="number"
                value={formData.minOrder || ''}
                onChange={(e) => setFormData({...formData, minOrder: e.target.value ? Number(e.target.value) : undefined})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount ($)</label>
              <input
                type="number"
                value={formData.maxDiscount || ''}
                onChange={(e) => setFormData({...formData, maxDiscount: e.target.value ? Number(e.target.value) : undefined})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
              <input
                type="date"
                value={formData.expiresAt || ''}
                onChange={(e) => setFormData({...formData, expiresAt: e.target.value || undefined})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
              <input
                type="number"
                value={formData.usageLimit || ''}
                onChange={(e) => setFormData({...formData, usageLimit: e.target.value ? Number(e.target.value) : undefined})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Optional"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleCreate}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Create Code
              </button>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Internal description of this code"
            />
          </div>
        </div>

        {/* Active Codes */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-medium">Active Codes</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {discounts.map((code) => (
                <tr key={code.id} className={code.active ? '' : 'bg-gray-50'}>
                  <td className="px-6 py-4 font-mono text-sm">{code.code}</td>
                  <td className="px-6 py-4 text-sm">
                    {code.type === 'percentage' ? `${code.value}%` : `$${code.value}`}
                    {code.maxDiscount && <span className="text-gray-500"> (max ${code.maxDiscount})</span>}
                  </td>
                  <td className="px-6 py-4 text-sm">{code.minOrder ? `$${code.minOrder}` : '—'}</td>
                  <td className="px-6 py-4 text-sm">
                    {code.usageCount}
                    {code.usageLimit && <span className="text-gray-500"> / {code.usageLimit}</span>}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(code.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        code.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {code.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(code.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {discounts.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No discount codes yet. Create one above.
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-2">How to Use</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Click "Active/Inactive" to enable or disable codes instantly</li>
            <li>• Changes are automatically saved to GitHub and persist across deployments</li>
            <li>• Vercel will auto-redeploy when you make changes (~2 minutes)</li>
            <li>• Usage count tracks how many times a code has been successfully applied</li>
            <li>• Secret codes are never shown to customers - they must discover or be told</li>
          </ul>
        </div>
      </div>
    </div>
  );
}