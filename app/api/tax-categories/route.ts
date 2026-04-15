import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertTaxCategorySchema } from '@shared/schema';
import { getAuthUser } from '@/lib/api-utils';
import { z } from 'zod';

export async function GET() {
  try {
    const taxCategories = await storage.getAllTaxCategories();
    return NextResponse.json(taxCategories);
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
    const validatedData = insertTaxCategorySchema.parse(body);
    const taxCategory = await storage.createTaxCategory(validatedData);
    return NextResponse.json(taxCategory, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create tax category' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  // Convenience: allow bulk update via collection endpoint
  return NextResponse.json({ message: 'Use /api/tax-categories/[id] for individual updates' }, { status: 405 });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ message: 'Use /api/tax-categories/[id] for individual deletion' }, { status: 405 });
}
