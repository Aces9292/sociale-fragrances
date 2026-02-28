'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { getProductImage } from '@/lib/images';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            name: item.name,
            size: item.size,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-8">Your Cart</h1>
          <p className="text-lg text-gray-600 mb-8">Your cart is empty.</p>
          <Link
            href="/shop"
            className="inline-block bg-black text-white px-8 py-4 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-serif mb-12 text-center">Your Cart</h1>

        {/* Cart Items */}
        <div className="space-y-6 mb-12">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 py-6 border-b border-gray-200">
              {/* Product Image */}
              <div className="w-24 h-24 relative flex-shrink-0 bg-gray-100">
                <Image
                  src={getProductImage(item.productId)}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="font-serif text-lg mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{item.size}</p>
                <p className="font-medium">${item.price.toFixed(2)}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-400 hover:text-black text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="bg-gray-50 rounded-lg p-8">
          <div className="flex justify-between mb-4">
            <span className="text-gray-600">Subtotal ({totalItems} items)</span>
            <span className="font-medium">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-600">Shipping</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between mb-8 pt-4 border-t border-gray-200">
            <span className="font-serif text-lg">Total</span>
            <span className="font-serif text-lg">${totalPrice.toFixed(2)}</span>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className={`w-full py-4 text-sm uppercase tracking-wider transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {loading ? 'Processing...' : 'Proceed to Checkout'}
          </button>

          <div className="mt-6 text-center">
            <Link
              href="/shop"
              className="text-sm uppercase tracking-wider text-gray-500 hover:text-black transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex justify-center gap-8 text-gray-400 text-sm">
          <span>🔒 Secure Checkout</span>
          <span>📦 Free Shipping</span>
          <span>↩️ 30-Day Returns</span>
        </div>
      </div>
    </div>
  );
}
