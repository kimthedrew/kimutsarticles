import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Like from '@/models/Like';
import Article from '@/models/Article';

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const ipAddress = getClientIP(request);
    
    const count = await Like.countDocuments({ article: params.id });
    const hasLiked = await Like.exists({ article: params.id, ipAddress });

    return NextResponse.json({ count, hasLiked: !!hasLiked });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const ipAddress = getClientIP(request);

    const article = await Article.findById(params.id);
    if (!article || !article.likesEnabled) {
      return NextResponse.json({ error: 'Likes disabled' }, { status: 403 });
    }

    await Like.create({ article: params.id, ipAddress });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to like' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const ipAddress = getClientIP(request);

    await Like.deleteOne({ article: params.id, ipAddress });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to unlike' }, { status: 500 });
  }
}
