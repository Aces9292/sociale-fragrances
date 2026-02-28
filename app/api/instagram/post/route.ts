import { NextResponse } from 'next/server';
import { postToInstagram } from '@/lib/instagram';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl, caption } = body;

    if (!imageUrl || !caption) {
      return NextResponse.json(
        { success: false, error: 'imageUrl and caption are required' },
        { status: 400 }
      );
    }

    const result = await postToInstagram(imageUrl, caption);

    return NextResponse.json({
      success: true,
      postId: result.id,
      message: 'Post published successfully',
    });
  } catch (error) {
    console.error('Error posting to Instagram:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to post', details: String(error) },
      { status: 500 }
    );
  }
}
