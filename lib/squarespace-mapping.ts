// Mapping between our product slugs and Squarespace product IDs
// This enables direct "Add to Cart" functionality via Squarespace

export const SQUARESPACE_STORE_URL = 'https://www.socialecandles.com';

export const productIdMapping: Record<string, string> = {
  'ma': '607497540559aa586dd22429',
  'fire-island': '60b5a29868146f31b45a9d45',
  'palm-springs': '60b5a31a68146f31b45a9d86',
  'asbury-park': '60b5a35dce451e2727369b74',
  'provincetown': '60b5a2e5ce451e2727369b43',
  'hipster': '6023fecfa8df8a132b86afbd',
  'bro': '6023435e78e14e4765bdf7cc',
  'ivy-leaguer': '6023fe2c73d1f51a6450f467',
  'pride-collection-bundle': '60b5a54dce451e2727369c2a',
  'boyfriend-bundle': '6061fba91982d25888984d72',
  'candle-of-the-month': '6061f8c104f40a77517782c9',
  'pride-match-set': '60b5bb46ce451e272736aad4',
};

// Variant ID mapping for specific sizes
// Format: productSlug-sizeName -> variantId
export const variantIdMapping: Record<string, Record<string, string>> = {
  'ma': {
    'Bedroom Size': '607497540559aa586dd22429-bedroom', // We'll get actual IDs
    'Living Room Size': '607497540559aa586dd22429-living',
  },
  'fire-island': {
    'Bedroom Size': 'bedroom-fi',
    'Living Room Size': 'living-fi',
  },
  // Add more as needed
};

// Get Squarespace product URL
export function getSquarespaceProductUrl(slug: string): string {
  const productId = productIdMapping[slug];
  if (!productId) {
    return `${SQUARESPACE_STORE_URL}/shop-candles`;
  }
  return `${SQUARESPACE_STORE_URL}/shop-candles`;
}

// Get Add to Cart URL (redirects to Squarespace with item in cart)
export function getAddToCartUrl(slug: string, variantId?: string): string {
  // Squarespace uses product page URL for add to cart
  // The user will select size on Squarespace and add to cart there
  return `${SQUARESPACE_STORE_URL}/shop-candles`;
}

// Get direct checkout URL
export function getCheckoutUrl(): string {
  return `${SQUARESPACE_STORE_URL}/checkout`;
}
