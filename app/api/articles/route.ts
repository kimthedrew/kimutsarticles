import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Article from '@/models/Article';

export async function GET() {
  try {
    await dbConnect();
    const articles = await Article.find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .select('title excerpt category tags views publishedAt');
    
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles', details: error.message }, { status: 500 });
  }
}
