import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertMenuItemChoiceGroupSchema } from '@shared/schema';
import { getAuthUser } from '@/lib/api-utils';
import { z } from 'zod';

interface Params { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = insertMenuItemChoiceGroupSchema.partial().parse(body);
    const group = await storage.updateMenuItemChoiceGroup(parseInt(id), validatedData);
    if (!group) {
      return NextResponse.json({ message: 'Menu item choice group not found' }, { status: 404 });
    }
    return NextResponse.json(group);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to update menu item choice group' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await storage.deleteMenuItemChoiceGroup(parseInt(id));
    if (!deleted) {
      return NextResponse.json({ message: 'Menu item choice group not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Menu item choice group deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
