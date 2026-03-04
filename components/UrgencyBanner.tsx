'use client';

import { useState, useEffect } from 'react';
import { Clock, Package, TrendingUp } from 'lucide-react';

export default function UrgencyBanner() {
  const [timeLeft, setTimeLeft] = useState('');
  const [viewerCount] = useState(Math.floor(Math.random() * 8) + 7); // 7-15 viewers

  useEffect(() => {
    const calculateTimeLeft = () => {
      const mothersDay = new Date('2026-05-11T23:59:59');
      const now = new Date();
      const diff = mothersDay.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      return `${days}d ${hours}h`;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-3 mb-6">
      {/* Limited Batch Alert */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Package className="text-pink-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="font-semibold text-gray-900">⚠️ Limited First Batch</p>
            <p className="text-sm text-gray-700">Only <strong>50 candles</strong> in this first production run</p>
          </div>
        </div>
      </div>

      {/* Mother's Day Countdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Clock className="text-purple-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Mother's Day Delivery</p>
            <p className="text-sm text-gray-700">
              Order by <strong>March 20</strong> to guarantee delivery • {timeLeft} left
            </p>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-white border border-green-200 rounded-lg p-3">
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="text-green-600" size={16} />
          <span className="text-gray-700">
            <strong>{viewerCount} people</strong> are viewing this product right now
          </span>
        </div>
      </div>
    </div>
  );
}
