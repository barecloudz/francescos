import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

interface Params { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const category = await storage.updateCategory(parseInt(id), body);
    return NextResponse.json(category);
  } catch (error: any) {
    console.error('PUT /api/categories/[id] error:', error);
    return NextResponse.json({ message: error.message || 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await storage.deleteCategory(parseInt(id));
    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('DELETE /api/categories/[id] error:', error);
    return NextResponse.json({ message: error.message || 'Failed to delete category' }, { status: 500 });
  }
}
