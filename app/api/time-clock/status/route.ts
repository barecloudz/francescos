import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const activeEntry = await storage.getActiveTimeEntry(user.id);
    const todaysSchedule = await storage.getTodaysSchedule(user.id);

    return NextResponse.json({
      isClocked: !!activeEntry,
      activeEntry,
      todaysSchedule,
    });
  } catch (error: any) {
    console.error('GET /api/time-clock/status error:', error);
    return NextResponse.json({ message: 'Failed to get clock status' }, { status: 500 });
  }
}
