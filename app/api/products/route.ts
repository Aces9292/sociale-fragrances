import { NextResponse } from 'next/server';
import { fetchSquarespaceProducts, filterCandleProducts, transformProduct } from '@/lib/squarespace';

export async function GET() {
  try {
    const allProducts = await fetchSquarespaceProducts();
    const candleProducts = filterCandleProducts(allProducts);
    const transformed = candleProducts.map(transformProduct);
    
    return NextResponse.json({
      success: true,
      products: transformed,
      count: transformed.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
