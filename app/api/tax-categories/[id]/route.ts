import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertTaxCategorySchema } from '@shared/schema';
import { getAuthUser } from '@/lib/api-utils';
import { z } from 'zod';

interface Params { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const taxCategory = await storage.getTaxCategory(parseInt(id));
    if (!taxCategory) {
      return NextResponse.json({ message: 'Tax category not found' }, { status: 404 });
    }
    return NextResponse.json(taxCategory);
  } catch (error: any) {
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
    const validatedData = insertTaxCategorySchema.partial().parse(body);
    const taxCategory = await storage.updateTaxCategory(parseInt(id), validatedData);
    if (!taxCategory) {
      return NextResponse.json({ message: 'Tax category not found' }, { status: 404 });
    }
    return NextResponse.json(taxCategory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to update tax category' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await storage.deleteTaxCategory(parseInt(id));
    if (!deleted) {
      return NextResponse.json({ message: 'Tax category not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Tax category deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
