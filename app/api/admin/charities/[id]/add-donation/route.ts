import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { charityOrganizations } from '@shared/schema';
import { eq } from 'drizzle-orm';

interface Params { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { amount } = body;

    const charity = await db.query.charityOrganizations.findFirst({
      where: (c, { eq }) => eq(c.id, parseInt(id)),
    });

    if (!charity) {
      return NextResponse.json({ message: 'Charity not found' }, { status: 404 });
    }

    const currentTotal = parseFloat(charity.totalRaised || '0');
    const newTotal = currentTotal + parseFloat(amount);

    const updated = await db
      .update(charityOrganizations)
      .set({ totalRaised: newTotal.toFixed(2), updatedAt: new Date() })
      .where(eq(charityOrganizations.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error: any) {
    console.error('POST /api/admin/charities/[id]/add-donation error:', error);
    return NextResponse.json({ message: 'Failed to add donation', error: error.message }, { status: 500 });
  }
}
