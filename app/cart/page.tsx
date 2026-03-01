'use client';

import Link from 'next/link';

export default function CartPage() {
  // Simple redirect to Squarespace cart
  return (
    <div className="bg-white min-h-screen py-24">
      <div className="max-w-2xl mx-auto px-6 text-center">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-serif mb-8">Your Cart</h1>

        {/* Redirect Notice */}
        <div className="bg-gray-50 rounded-lg p-8 mb-8">
          <p className="text-lg text-gray-700 mb-6">
            Complete your purchase through our secure checkout.
          </p>
          
          <a
            href="https://maroon-sprout-936t.squarespace.com/cart"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black text-white px-8 py-4 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
          >
            View Cart & Checkout
          </a>
        </div>

        {/* Continue Shopping */}
        <Link 
          href="/shop"
          className="text-sm uppercase tracking-wider text-gray-500 hover:text-black transition-colors"
        >
          ← Continue Shopping
        </Link>

        {/* How It Works */}
        <div className="mt-16 text-left">
          <h2 className="text-xl font-serif mb-6 text-center">How Checkout Works</h2>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">1</span>
              <p>Click "Add to Cart" on any product</p>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">2</span>
              <p>Complete checkout with secure payment</p>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">3</span>
              <p>Receive confirmation and tracking info via email</p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-center gap-8 text-gray-400 text-sm">
            <span>🔒 Secure Checkout</span>
            <span>📦 Free Shipping $75+</span>
            <span>↩️ 30-Day Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
}