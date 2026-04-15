import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 401 });
    }

    console.log(`Admin ${user.email} initiated full data reset (orders + points)`);
    const success = await storage.resetAllData();

    if (success) {
      return NextResponse.json({ message: 'All orders and customer points have been reset successfully', success: true });
    } else {
      return NextResponse.json({ message: 'Failed to reset all data', success: false }, { status: 500 });
    }
  } catch (error: any) {
    console.error('POST /api/admin/reset/all error:', error);
    return NextResponse.json({ message: 'Error resetting all data: ' + error.message, success: false }, { status: 500 });
  }
}
