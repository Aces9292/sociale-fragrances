'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function EmailPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenPopup = localStorage.getItem('sociale_email_popup_seen');
      if (!hasSeenPopup) {
        setIsVisible(true);
      }
    }, 15000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        const hasSeenPopup = localStorage.getItem('sociale_email_popup_seen');
        if (!hasSeenPopup) {
          setIsVisible(true);
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSuccess(true);
        localStorage.setItem('sociale_email_popup_seen', 'true');
        setTimeout(() => setIsVisible(false), 2000);
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('sociale_email_popup_seen', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md mx-4 p-8">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        {!isSuccess ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">For the teens we were 🦋</h2>
              <p className="text-gray-600">Get 10% off your first Millennial Ma + Mother's Day gift guide</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 disabled:opacity-50"
              >
                {isSubmitting ? 'Subscribing...' : 'Get My 10% Off'}
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4">
              Unsubscribe anytime. We only send nostalgia + self-care tips.
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🕯️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">You're in!</h3>
            <p className="text-gray-600">Check your email for your 10% off code</p>
          </div>
        )}
      </div>
    </div>
  );
}
