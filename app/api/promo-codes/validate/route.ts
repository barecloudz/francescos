import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ message: 'Promo code is required' }, { status: 400 });
    }

    const promoCode = await storage.getPromoCodeByCode(code);

    if (!promoCode) {
      return NextResponse.json({ message: 'Invalid promo code' }, { status: 404 });
    }

    if (!promoCode.isActive) {
      return NextResponse.json({ message: 'Promo code is inactive' }, { status: 400 });
    }

    if (promoCode.currentUses >= promoCode.maxUses) {
      return NextResponse.json({ message: 'Promo code usage limit reached' }, { status: 400 });
    }

    if (new Date() > promoCode.endDate) {
      return NextResponse.json({ message: 'Promo code has expired' }, { status: 400 });
    }

    return NextResponse.json({
      code: promoCode.code,
      discount: Number(promoCode.discount),
      discountType: promoCode.discountType,
      minOrderAmount: Number(promoCode.minOrderAmount),
    });
  } catch (error: any) {
    console.error('POST /api/promo-codes/validate error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
