import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

export async function GET() {
  try {
    const categoriesList = await storage.getAllCategories();
    return NextResponse.json({ categories: categoriesList });
  } catch (error: any) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const category = await storage.createCategory(body);
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/categories error:', error);
    return NextResponse.json({ message: error.message || 'Failed to create category' }, { status: 500 });
  }
}
