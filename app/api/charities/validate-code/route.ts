import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;
    const today = new Date().toISOString().split('T')[0];

    const charity = await db.query.charityOrganizations.findFirst({
      where: (c, { and, eq, lte, gte }) =>
        and(
          eq(c.promoCode, code.toUpperCase()),
          eq(c.isActive, true),
          lte(c.startDate, today),
          gte(c.endDate, today)
        ),
    });

    if (!charity) {
      return NextResponse.json({ valid: false, message: 'Invalid or expired charity code' });
    }

    return NextResponse.json({
      valid: true,
      charityId: charity.id,
      charityName: charity.name,
      customerDiscount: charity.customerDiscount,
      donationPercent: charity.donationPercent,
    });
  } catch (error: any) {
    console.error('POST /api/charities/validate-code error:', error);
    return NextResponse.json({ message: 'Failed to validate code', error: error.message }, { status: 500 });
  }
}
