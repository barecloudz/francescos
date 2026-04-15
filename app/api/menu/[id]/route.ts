import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertMenuItemSchema } from '@shared/schema';
import { getAuthUser } from '@/lib/api-utils';
import { db } from '@/lib/db';
import { orderItems, menuItemChoiceGroups, menuItems } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

interface Params { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const menuItem = await storage.getMenuItem(parseInt(id));

    if (!menuItem) {
      return NextResponse.json({ message: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json(menuItem);
  } catch (error: any) {
    console.error('GET /api/menu/[id] error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = insertMenuItemSchema.partial().parse(body);
    const menuItem = await storage.updateMenuItem(parseInt(id), validatedData);

    if (!menuItem) {
      return NextResponse.json({ message: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    console.error('PUT /api/menu/[id] error:', error);
    return NextResponse.json({ message: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = insertMenuItemSchema.partial().parse(body);
    const menuItem = await storage.updateMenuItem(parseInt(id), validatedData);

    if (!menuItem) {
      return NextResponse.json({ message: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    console.error('PATCH /api/menu/[id] error:', error);
    return NextResponse.json({ message: 'Failed to patch menu item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const numericId = parseInt(id);

    // Enforce FK safety: block deletion if order items reference this menu item.
    const orderItemsCheck = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.menuItemId, numericId))
      .limit(1);

    if (orderItemsCheck.length > 0) {
      return NextResponse.json(
        { message: 'Cannot delete menu item. It is being used in existing orders. Consider marking it as unavailable instead.' },
        { status: 400 }
      );
    }

    // Block deletion if choice group assignments exist.
    const choiceGroupsCheck = await db
      .select()
      .from(menuItemChoiceGroups)
      .where(eq(menuItemChoiceGroups.menuItemId, numericId))
      .limit(1);

    if (choiceGroupsCheck.length > 0) {
      return NextResponse.json(
        { message: 'Cannot delete menu item. It has associated choice groups. Please remove the choice group assignments first.' },
        { status: 400 }
      );
    }

    const result = await db
      .delete(menuItems)
      .where(eq(menuItems.id, numericId))
      .returning({ id: menuItems.id });

    if (result.length === 0) {
      return NextResponse.json({ message: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Menu item deleted successfully' });
  } catch (error: any) {
    console.error('DELETE /api/menu/[id] error:', error);
    return NextResponse.json({ message: 'Failed to process menu item request', error: error.message }, { status: 500 });
  }
}
