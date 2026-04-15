import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

interface Params { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 401 });
    }

    const { id } = await params;
    await storage.markAlertAsRead(parseInt(id));
    return NextResponse.json({ message: 'Alert marked as read' });
  } catch (error: any) {
    console.error('PATCH /api/admin/alerts/[id]/read error:', error);
    return NextResponse.json({ message: 'Failed to mark alert as read' }, { status: 500 });
  }
}
