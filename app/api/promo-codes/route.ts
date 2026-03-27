import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertPromoCodeSchema } from '@shared/schema';
import { getAuthUser } from '@/lib/api-utils';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const promoCodes = await storage.getAllPromoCodes();
    return NextResponse.json(promoCodes);
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
    const validatedData = insertPromoCodeSchema.parse(body);
    const promoCode = await storage.createPromoCode(validatedData);
    return NextResponse.json(promoCode, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }
    console.error('POST /api/promo-codes error:', error);
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Failed to create promo code' }, { status: 500 });
  }
}
