// Squarespace Commerce API Integration
const SQUARESPACE_API_KEY = process.env.SQUARESPACE_API_KEY || '2226ae01-f7b6-44e0-a6f7-2013bd7c0803';
const SQUARESPACE_API_URL = 'https://api.squarespace.com/1.0/commerce';

// Your Squarespace store checkout URL
const SQUARESPACE_STORE_URL = 'https://www.socialecandles.com';

export interface SquarespaceVariant {
  id: string;
  sku: string;
  pricing: {
    basePrice: { value: string; currency: string };
    salePrice?: { value: string; currency: string };
    onSale: boolean;
  };
  stock: { quantity: number; unlimited: boolean };
  attributes: Record<string, string>;
  image?: { url: string };
}

export interface SquarespaceProduct {
  id: string;
  type: string;
  name: string;
  description: string;
  url: string;
  urlSlug: string;
  images: Array<{ url: string; altText: string }>;
  tags: string[];
  isVisible: boolean;
  variants: SquarespaceVariant[];
  variantAttributes: string[];
}

export interface SquarespaceProductsResponse {
  products: SquarespaceProduct[];
  pagination?: {
    hasNextPage: boolean;
    nextPageCursor: string;
  };
}

// Fetch all products from Squarespace
export async function fetchSquarespaceProducts(): Promise<SquarespaceProduct[]> {
  const response = await fetch(`${SQUARESPACE_API_URL}/products`, {
    headers: {
      'Authorization': `Bearer ${SQUARESPACE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!response.ok) {
    throw new Error(`Squarespace API error: ${response.status}`);
  }

  const data: SquarespaceProductsResponse = await response.json();
  return data.products;
}

// Filter to only candle products (exclude apparel, accessories)
export function filterCandleProducts(products: SquarespaceProduct[]): SquarespaceProduct[] {
  const candleNames = [
    'Ma', 'Millennial Ma',
    'Fire Island', 'Palm Springs', 'Asbury Park', 'Provincetown',
    'Hipster', 'Bro', 'Ivy Leaguer',
    'Pride Collection Bundle', 'Bundle and Save - Boyfriend Collection',
    'Candle of the Month', 'Pride Match Set'
  ];
  
  return products.filter(p => 
    candleNames.some(name => p.name.toLowerCase().includes(name.toLowerCase())) ||
    p.tags?.some(tag => tag.toLowerCase().includes('candle'))
  );
}

// Transform Squarespace product to our format
export function transformProduct(sqProduct: SquarespaceProduct) {
  const sizes = sqProduct.variants.map(v => ({
    id: v.id,
    name: v.attributes?.Size || v.attributes?.['Size'] || 'Standard',
    size: extractOzSize(v.attributes?.Size || ''),
    price: parseFloat(v.pricing.basePrice.value),
    stock: v.stock.quantity,
    sku: v.sku,
  }));

  // Get lowest price as base price
  const basePrice = Math.min(...sizes.map(s => s.price));
  const totalStock = sizes.reduce((sum, s) => sum + s.stock, 0);

  // Determine collection from tags or name
  let collection = 'special';
  if (sqProduct.tags?.some(t => t.toLowerCase().includes('pride')) || 
      ['Fire Island', 'Palm Springs', 'Asbury Park', 'Provincetown'].some(n => sqProduct.name.includes(n))) {
    collection = 'pride';
  } else if (sqProduct.tags?.some(t => t.toLowerCase().includes('boyfriend')) ||
             ['Hipster', 'Bro', 'Ivy Leaguer'].some(n => sqProduct.name.includes(n))) {
    collection = 'boyfriend';
  }

  return {
    id: sqProduct.id,
    name: sqProduct.name,
    slug: generateSlug(sqProduct.name),
    squarespaceUrl: sqProduct.url,
    collection,
    price: basePrice,
    stock: totalStock,
    description: stripHtml(sqProduct.description),
    images: sqProduct.images.map(img => img.url),
    sizes,
    isVisible: sqProduct.isVisible,
  };
}

// Generate checkout URL for a specific variant
export function getCheckoutUrl(productSlug: string, variantId?: string): string {
  // Squarespace quick add to cart URL format
  if (variantId) {
    return `${SQUARESPACE_STORE_URL}/cart?add=${variantId}`;
  }
  return `${SQUARESPACE_STORE_URL}/shop-candles`;
}

// Helper: Extract oz size from variant name
function extractOzSize(sizeName: string): string {
  const match = sizeName.match(/(\d+)\s*oz/i);
  return match ? `${match[1]} oz` : sizeName;
}

// Helper: Generate URL slug from product name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper: Strip HTML tags from description
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Get inventory for a specific product
export async function getProductInventory(productId: string): Promise<SquarespaceProduct | null> {
  const products = await fetchSquarespaceProducts();
  return products.find(p => p.id === productId) || null;
}
