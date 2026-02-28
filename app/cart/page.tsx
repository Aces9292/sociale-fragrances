import { Metadata } from 'next';
import Button from '@/components/Button';

export const metadata: Metadata = {
  title: 'Cart | SOCIALE',
  description: 'Your shopping cart.',
};

export default function CartPage() {
  // This is a placeholder - cart functionality would be implemented with state management
  const cartItems: any[] = [];

  return (
    <div className="bg-white py-4xl">
      <div className="max-w-text mx-auto px-md">
        {/* Title */}
        <h1 className="text-title font-serif text-center mb-3xl">Cart</h1>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-3xl">
            <p className="text-body mb-xl">Your cart is empty.</p>
            <Button href="/shop">Continue Shopping</Button>
          </div>
        ) : (
          /* Cart Items - To be implemented */
          <div>
            {/* Cart items would render here */}
          </div>
        )}
      </div>
    </div>
  );
}
