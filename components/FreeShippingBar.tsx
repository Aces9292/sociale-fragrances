'use client';

import { Truck } from 'lucide-react';

export default function FreeShippingBar() {
  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-4 rounded-lg mb-6">
      <div className="flex items-center justify-center gap-2 text-sm font-medium">
        <Truck size={18} />
        <span>FREE SHIPPING on orders over $50 (add both sizes!)</span>
      </div>
    </div>
  );
}
