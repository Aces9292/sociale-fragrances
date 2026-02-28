import { NextResponse } from 'next/server';

const SQUARESPACE_API_KEY = process.env.SQUARESPACE_API_KEY || '2226ae01-f7b6-44e0-a6f7-2013bd7c0803';
const SQUARESPACE_API_URL = 'https://api.squarespace.com/1.0/commerce';

// Simple auth - you can make this more secure
const SYNC_SECRET = process.env.SYNC_SECRET || 'sociale-sync-2026';

interface SquarespaceProduct {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string; altText: string }>;
  variants: Array<{
    id: string;
    sku: string;
    pricing: { basePrice: { value: string } };
    stock: { quantity: number };
    attributes: Record<string, string>;
  }>;
  tags: string[];
  isVisible: boolean;
}

const CANDLE_PRODUCTS = [
  'Ma', 'Fire Island', 'Palm Springs', 'Asbury Park', 'Provincetown',
  'Hipster', 'Bro', 'Ivy Leaguer',
  'Pride Collection Bundle', 'Bundle and Save - Boyfriend Collection',
  'Candle of the Month', 'Pride Match Set'
];

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function getCollection(product: SquarespaceProduct): string {
  const name = product.name.toLowerCase();
  const tags = product.tags?.map(t => t.toLowerCase()) || [];
  
  if (['fire island', 'palm springs', 'asbury park', 'provincetown'].some(n => name.includes(n)) ||
      tags.some(t => t.includes('pride'))) return 'pride';
  if (['hipster', 'bro', 'ivy leaguer'].some(n => name.includes(n)) ||
      tags.some(t => t.includes('boyfriend'))) return 'boyfriend';
  if (name.includes('subscription') || name.includes('month')) return 'subscription';
  if (name.includes('gift')) return 'gift';
  return 'special';
}

export async function POST(request: Request) {
  try {
    // Optional: Check auth
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    if (secret && secret !== SYNC_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch from Squarespace
    const response = await fetch(`${SQUARESPACE_API_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${SQUARESPACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Squarespace API error: ${response.status}`);
    }

    const data = await response.json();
    const allProducts: SquarespaceProduct[] = data.products || [];

    // Filter to candles
    const candleProducts = allProducts.filter(p => 
      CANDLE_PRODUCTS.some(name => p.name.toLowerCase().includes(name.toLowerCase()))
    );

    // Transform products
    const syncedProducts = candleProducts.map(product => {
      const slug = generateSlug(product.name);
      const sizes = product.variants.map(v => ({
        id: v.id,
        name: v.attributes?.Size || 'Standard',
        price: parseFloat(v.pricing.basePrice.value),
        stock: v.stock.quantity,
        sku: v.sku,
      }));

      return {
        id: product.id,
        name: product.name,
        slug,
        collection: getCollection(product),
        price: Math.min(...sizes.map(s => s.price)),
        stock: sizes.reduce((sum, s) => sum + s.stock, 0),
        description: stripHtml(product.description),
        sizes,
        images: product.images.map(img => img.url),
        isVisible: product.isVisible,
        lastSynced: new Date().toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Sync completed',
      productCount: syncedProducts.length,
      products: syncedProducts,
      syncedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { success: false, error: 'Sync failed', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Squarespace Sync API',
    usage: 'POST /api/sync to trigger a sync',
    lastSync: null, // Would need to store this somewhere
  });
}
