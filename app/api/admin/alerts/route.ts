import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 401 });
    }

    const url = new URL(request.url);
    const unreadOnly = url.searchParams.get('unreadOnly') === 'true';
    const alerts = await storage.getScheduleAlerts(unreadOnly);
    return NextResponse.json(alerts);
  } catch (error: any) {
    console.error('GET /api/admin/alerts error:', error);
    return NextResponse.json({ message: 'Failed to get alerts' }, { status: 500 });
  }
}
