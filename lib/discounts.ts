// lib/discounts.ts
export interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  expiresAt?: string;
  usageLimit?: number;
  usageCount: number;
  active: boolean;
  description: string;
}

// Default discount codes - can be overridden via admin
let DISCOUNT_CODES: DiscountCode[] = [
  {
    code: 'WELCOME15',
    type: 'percentage',
    value: 15,
    minOrder: 50,
    active: true,
    usageCount: 0,
    description: '15% off your first order over $50'
  },
  {
    code: 'MOTHERSDAY',
    type: 'percentage',
    value: 20,
    minOrder: 75,
    expiresAt: '2026-05-11',
    active: true,
    usageCount: 0,
    description: '20% off for Mother\'s Day (expires May 11, 2026)'
  },
  {
    code: 'FREESHIP',
    type: 'fixed',
    value: 10,
    minOrder: 100,
    maxDiscount: 10,
    active: true,
    usageCount: 0,
    description: 'Free shipping on orders over $100'
  },
  {
    code: 'WHOLESALE',
    type: 'percentage',
    value: 50,
    minOrder: 150,
    active: true,
    usageCount: 0,
    description: 'Wholesale pricing (50% off)'
  }
];

// Get current discount codes
export function getDiscountCodes(): DiscountCode[] {
  return DISCOUNT_CODES;
}

// Update discount codes (for admin use)
export function updateDiscountCodes(codes: DiscountCode[]) {
  DISCOUNT_CODES = codes;
}

// Export for backwards compatibility
export { DISCOUNT_CODES };

export function validateDiscountCode(code: string, subtotal: number): { 
  valid: boolean; 
  discount?: number; 
  message?: string;
  code?: DiscountCode;
} {
  const upperCode = code.toUpperCase().trim();
  const codes = getDiscountCodes();
  const discount = codes.find(d => 
    d.code === upperCode && d.active
  );

  if (!discount) {
    return { valid: false, message: 'Invalid discount code' };
  }

  // Check expiration
  if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
    return { valid: false, message: 'This code has expired' };
  }

  // Check usage limit
  if (discount.usageLimit && discount.usageCount >= discount.usageLimit) {
    return { valid: false, message: 'This code has reached its usage limit' };
  }

  // Check minimum order
  if (discount.minOrder && subtotal < discount.minOrder) {
    return { 
      valid: false, 
      message: `Minimum order of $${discount.minOrder} required` 
    };
  }

  // Calculate discount
  let discountAmount = 0;
  if (discount.type === 'percentage') {
    discountAmount = subtotal * (discount.value / 100);
  } else {
    discountAmount = discount.value;
  }

  // Apply max discount if set
  if (discount.maxDiscount && discountAmount > discount.maxDiscount) {
    discountAmount = discount.maxDiscount;
  }

  return { 
    valid: true, 
    discount: Math.round(discountAmount * 100) / 100,
    code: discount
  };
}