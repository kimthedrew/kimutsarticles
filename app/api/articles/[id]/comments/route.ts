import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Article from '@/models/Article';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const comments = await Comment.find({ 
      article: params.id, 
      status: 'approved' 
    }).sort({ createdAt: -1 });

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { author, email, content } = await request.json();

    const article = await Article.findById(params.id);
    if (!article || !article.commentsEnabled) {
      return NextResponse.json({ error: 'Comments disabled' }, { status: 403 });
    }

    const comment = await Comment.create({
      article: params.id,
      author,
      email,
      content,
      status: 'pending',
    });

    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit comment' }, { status: 500 });
  }
}
