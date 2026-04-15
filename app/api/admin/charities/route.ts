import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { charityOrganizations } from '@shared/schema';
import { getAuthUser } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newCharity = await db.insert(charityOrganizations).values({
      name: body.name,
      description: body.description,
      imageUrl: body.imageUrl || null,
      promoCode: body.promoCode.toUpperCase(),
      websiteUrl: body.websiteUrl || null,
      customerDiscount: body.customerDiscount || 5,
      donationPercent: body.donationPercent || 10,
      featuredDays: body.featuredDays || [],
      startDate: body.startDate,
      endDate: body.endDate,
      isActive: body.isActive !== false,
      displayOrder: body.displayOrder || 0,
    }).returning();

    return NextResponse.json(newCharity[0], { status: 201 });
  } catch (error: any) {
    console.error('POST /api/admin/charities error:', error);
    return NextResponse.json({ message: 'Failed to create charity', error: error.message }, { status: 500 });
  }
}
