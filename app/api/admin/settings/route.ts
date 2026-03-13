import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

export async function GET() {
  try {
    await connectDB();
    let settings = await SiteSettings.findOne();
    
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    await connectDB();

    let settings = await SiteSettings.findOne();
    
    if (!settings) {
      settings = await SiteSettings.create(data);
    } else {
      settings = await SiteSettings.findOneAndUpdate(
        {},
        { ...data, updatedAt: new Date() },
        { new: true }
      );
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
