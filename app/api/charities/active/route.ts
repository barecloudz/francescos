import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const charities = await db.query.charityOrganizations.findMany({
      where: (charityOrganizations, { and, eq, lte, gte }) =>
        and(
          eq(charityOrganizations.isActive, true),
          lte(charityOrganizations.startDate, today),
          gte(charityOrganizations.endDate, today)
        ),
      orderBy: (charityOrganizations, { asc }) => [asc(charityOrganizations.displayOrder)],
    });
    return NextResponse.json(charities);
  } catch (error: any) {
    console.error('GET /api/charities/active error:', error);
    return NextResponse.json({ message: 'Failed to fetch active charities', error: error.message }, { status: 500 });
  }
}
