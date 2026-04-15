import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { charityOrganizations } from '@shared/schema';
import { eq } from 'drizzle-orm';

interface Params { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const charity = await db.query.charityOrganizations.findFirst({
      where: (c, { eq }) => eq(c.id, parseInt(id)),
    });

    if (!charity) {
      return NextResponse.json({ message: 'Charity not found' }, { status: 404 });
    }

    return NextResponse.json(charity);
  } catch (error: any) {
    console.error('GET /api/charities/[id] error:', error);
    return NextResponse.json({ message: 'Failed to fetch charity', error: error.message }, { status: 500 });
  }
}
