'use client';

import { useState } from 'react';
import { validateDiscountCode } from '@/lib/discounts';

interface DiscountCodeInputProps {
  subtotal: number;
  onApply: (discount: number, code: string) => void;
  onRemove: () => void;
  appliedCode?: string;
  appliedDiscount?: number;
}

export default function DiscountCodeInput({ 
  subtotal, 
  onApply, 
  onRemove,
  appliedCode,
  appliedDiscount 
}: DiscountCodeInputProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleApply = () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setMessage('');
    
    // Simulate API call
    setTimeout(() => {
      const result = validateDiscountCode(code, subtotal);
      
      if (result.valid && result.discount !== undefined) {
        onApply(result.discount, code.toUpperCase().trim());
        setMessage(`✓ ${result.code?.description || 'Discount applied'}`);
        setIsError(false);
        setCode('');
      } else {
        setMessage(result.message || 'Invalid code');
        setIsError(true);
      }
      
      setIsLoading(false);
    }, 500);
  };

  const handleRemove = () => {
    onRemove();
    setMessage('');
    setCode('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  if (appliedCode && appliedDiscount !== undefined) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-800">
              Code Applied: {appliedCode}
            </p>
            <p className="text-sm text-green-600">
              You saved ${appliedDiscount.toFixed(2)}
            </p>
          </div>
          <button
            onClick={handleRemove}
            className="text-sm text-green-700 underline hover:no-underline"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-black/70">
        Discount Code
      </label>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          placeholder="Enter code (e.g., WELCOME15)"
          className="flex-1 px-4 py-3 border border-black/20 rounded-none text-sm uppercase placeholder:normal-case focus:outline-none focus:border-black"
          disabled={isLoading}
        />
        <button
          onClick={handleApply}
          disabled={isLoading || !code.trim()}
          className="px-6 py-3 bg-black text-white text-sm uppercase tracking-wider hover:bg-black/80 disabled:bg-black/40 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '...' : 'Apply'}
        </button>
      </div>

      {message && (
        <p className={`text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}

      <p className="text-xs text-black/40">
        Try: WELCOME15 (15% off $50+), MOTHERSDAY (20% off $75+)
      </p>
    </div>
  );
}