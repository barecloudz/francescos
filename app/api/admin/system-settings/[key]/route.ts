import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

interface Params { params: Promise<{ key: string }> }

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 401 });
    }

    const { key } = await params;
    const setting = await storage.getSystemSetting(key);

    if (!setting) {
      return NextResponse.json({ message: 'Setting not found' }, { status: 404 });
    }

    // Mask sensitive values before returning
    if (setting.is_sensitive && setting.setting_value) {
      setting.setting_value = '***';
    }

    return NextResponse.json(setting);
  } catch (error: any) {
    console.error('GET /api/admin/system-settings/[key] error:', error);
    return NextResponse.json({ message: 'Failed to fetch system setting' }, { status: 500 });
  }
}
