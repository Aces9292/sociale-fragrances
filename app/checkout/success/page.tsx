'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  // Clear cart on successful checkout
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="bg-white min-h-screen py-24">
      <div className="max-w-2xl mx-auto px-6 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif mb-6">Thank You!</h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Your order has been confirmed. We'll send you an email with your order details and tracking information.
        </p>

        <div className="bg-gray-50 rounded-lg p-8 mb-8 text-left">
          <h2 className="font-serif text-xl mb-4">What's Next?</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-green-600">✓</span>
              <span>You'll receive an order confirmation email shortly</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600">✓</span>
              <span>Your candles will be hand-poured with care</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600">✓</span>
              <span>Tracking info will be sent once shipped (5-7 business days)</span>
            </li>
          </ul>
        </div>

        <Link
          href="/shop"
          className="inline-block bg-black text-white px-8 py-4 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </Link>

        {/* Contact */}
        <p className="mt-8 text-sm text-gray-500">
          Questions? Email us at{' '}
          <a href="mailto:info@socialefragrances.com" className="underline">
            info@socialefragrances.com
          </a>
        </p>
      </div>
    </div>
  );
}
