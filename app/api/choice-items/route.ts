import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertChoiceItemSchema } from '@shared/schema';
import { getAuthUser } from '@/lib/api-utils';
import { z } from 'zod';

export async function GET() {
  try {
    const choiceItems = await storage.getAllChoiceItems();
    return NextResponse.json(choiceItems);
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
    const validatedData = insertChoiceItemSchema.parse(body);
    const choiceItem = await storage.createChoiceItem(validatedData);
    return NextResponse.json(choiceItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create choice item' }, { status: 500 });
  }
}
