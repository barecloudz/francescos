import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { charityOrganizations } from '@shared/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const charities = await db.query.charityOrganizations.findMany({
      orderBy: (charityOrganizations, { asc }) => [asc(charityOrganizations.displayOrder)],
    });
    return NextResponse.json(charities);
  } catch (error: any) {
    console.error('GET /api/charities error:', error);
    return NextResponse.json({ message: 'Failed to fetch charities', error: error.message }, { status: 500 });
  }
}
