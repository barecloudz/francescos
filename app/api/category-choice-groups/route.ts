import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertCategoryChoiceGroupSchema } from '@shared/schema';
import { getAuthUser } from '@/lib/api-utils';
import { z } from 'zod';

export async function GET() {
  try {
    const groups = await storage.getAllCategoryChoiceGroups();
    return NextResponse.json(groups);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = insertCategoryChoiceGroupSchema.parse(body);
    const group = await storage.createCategoryChoiceGroup(validatedData);
    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create category choice group' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;
    const deleted = await storage.deleteCategoryChoiceGroup(id);
    if (!deleted) {
      return NextResponse.json({ message: 'Category choice group not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Category choice group deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
