import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertMenuItemChoiceGroupSchema } from '@shared/schema';
import { getAuthUser } from '@/lib/api-utils';
import { z } from 'zod';

export async function GET() {
  try {
    const groups = await storage.getAllMenuItemChoiceGroups();
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
    const validatedData = insertMenuItemChoiceGroupSchema.parse(body);
    const group = await storage.createMenuItemChoiceGroup(validatedData);
    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create menu item choice group' }, { status: 500 });
  }
}
