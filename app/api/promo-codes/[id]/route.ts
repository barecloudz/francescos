import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertPromoCodeSchema } from '@shared/schema';
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
    const validatedData = insertPromoCodeSchema.partial().parse(body);
    const promoCode = await storage.updatePromoCode(parseInt(id), validatedData);

    if (!promoCode) {
      return NextResponse.json({ message: 'Promo code not found' }, { status: 404 });
    }

    return NextResponse.json(promoCode);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') }, { status: 400 });
    }
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Failed to update promo code' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await storage.deletePromoCode(parseInt(id));

    if (!deleted) {
      return NextResponse.json({ message: 'Promo code not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Promo code deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
