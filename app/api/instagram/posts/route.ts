import { NextResponse } from 'next/server';
import { getInstagramPosts, getProductPhotos } from '@/lib/instagram';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const productOnly = searchParams.get('product_only') === 'true';

    const posts = productOnly 
      ? await getProductPhotos(limit)
      : await getInstagramPosts(limit);

    return NextResponse.json({
      success: true,
      posts,
      count: posts.length,
    });
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts', details: String(error) },
      { status: 500 }
    );
  }
}
