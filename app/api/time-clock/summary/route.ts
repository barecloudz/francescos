import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    const summary = await storage.getEmployeeTimeSummary(
      user.id,
      startDate ?? undefined,
      endDate ?? undefined
    );

    return NextResponse.json(summary);
  } catch (error: any) {
    console.error('GET /api/time-clock/summary error:', error);
    return NextResponse.json({ message: 'Failed to get time summary' }, { status: 500 });
  }
}
