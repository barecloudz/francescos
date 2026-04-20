import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET() {
  try {
    const featuredItems = await storage.getFeaturedMenuItems();
    return NextResponse.json(featuredItems);
  } catch (error: any) {
    console.error('GET /api/featured error:', error);
    return NextResponse.json({ message: 'Failed to fetch featured items' }, { status: 500 });
  }
}
