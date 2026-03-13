import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BackgroundImage from '@/models/BackgroundImage';

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await connectDB();
    const activeImage = await BackgroundImage.findOne({ isActive: true });
    
    // Return with no-cache headers
    return NextResponse.json(activeImage || null, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch active image' }, { status: 500 });
  }
}
