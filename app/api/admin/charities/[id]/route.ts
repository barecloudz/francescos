import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { charityOrganizations } from '@shared/schema';
import { eq } from 'drizzle-orm';

interface Params { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await db
      .update(charityOrganizations)
      .set({
        name: body.name,
        description: body.description,
        imageUrl: body.imageUrl,
        promoCode: body.promoCode?.toUpperCase(),
        websiteUrl: body.websiteUrl,
        customerDiscount: body.customerDiscount,
        donationPercent: body.donationPercent,
        featuredDays: body.featuredDays,
        startDate: body.startDate,
        endDate: body.endDate,
        isActive: body.isActive,
        displayOrder: body.displayOrder,
        totalRaised: body.totalRaised,
        updatedAt: new Date(),
      })
      .where(eq(charityOrganizations.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ message: 'Charity not found' }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error: any) {
    console.error('PUT /api/admin/charities/[id] error:', error);
    return NextResponse.json({ message: 'Failed to update charity', error: error.message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const result = await db
      .delete(charityOrganizations)
      .where(eq(charityOrganizations.id, parseInt(id)))
      .returning({ id: charityOrganizations.id });

    if (result.length === 0) {
      return NextResponse.json({ message: 'Charity not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Charity deleted' });
  } catch (error: any) {
    console.error('DELETE /api/admin/charities/[id] error:', error);
    return NextResponse.json({ message: 'Failed to delete charity', error: error.message }, { status: 500 });
  }
}
