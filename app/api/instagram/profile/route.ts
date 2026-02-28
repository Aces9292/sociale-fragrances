import { NextResponse } from 'next/server';
import { getInstagramProfile } from '@/lib/instagram';

export async function GET() {
  try {
    const profile = await getInstagramProfile();

    return NextResponse.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error('Error fetching Instagram profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile', details: String(error) },
      { status: 500 }
    );
  }
}
