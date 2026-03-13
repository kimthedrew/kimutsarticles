import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BackgroundImage from '@/models/BackgroundImage';

export async function GET() {
  try {
    await connectDB();
    const activeImage = await BackgroundImage.findOne({ isActive: true });
    return NextResponse.json(activeImage || null);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch active image' }, { status: 500 });
  }
}
