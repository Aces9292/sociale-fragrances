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

// Import from JSON file for server-side, fallback for client-side
import discountsData from '@/data/discounts.json';

// Default discount codes from JSON
let DISCOUNT_CODES: DiscountCode[] = discountsData.discounts as DiscountCode[];

// Get current discount codes
export function getDiscountCodes(): DiscountCode[] {
  return DISCOUNT_CODES;
}

// Update discount codes (for admin use)
export function updateDiscountCodes(codes: DiscountCode[]) {
  DISCOUNT_CODES = codes;
}

// Set discount codes from API response
export function setDiscountCodes(codes: DiscountCode[]) {
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