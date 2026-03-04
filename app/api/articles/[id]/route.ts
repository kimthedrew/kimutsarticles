import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Article from '@/models/Article';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const article = await Article.findById(params.id);
    
    if (!article || article.status !== 'published') {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    article.views += 1;
    await article.save();

    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}
