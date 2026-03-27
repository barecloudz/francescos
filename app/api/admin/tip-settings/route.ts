import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 401 });
    }

    const tipSettings = await storage.getTipSettings();
    return NextResponse.json(tipSettings);
  } catch (error: any) {
    console.error('GET /api/admin/tip-settings error:', error);
    return NextResponse.json({ message: 'Failed to get tip settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    const updated = await storage.updateTipSettings(body);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('PUT /api/admin/tip-settings error:', error);
    return NextResponse.json({ message: 'Failed to update tip settings' }, { status: 500 });
  }
}
