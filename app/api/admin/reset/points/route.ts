import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 401 });
    }

    console.log(`Admin ${user.email} initiated customer points reset`);
    const success = await storage.resetAllCustomerPoints();

    if (success) {
      return NextResponse.json({ message: 'All customer points have been reset to zero', success: true });
    } else {
      return NextResponse.json({ message: 'Failed to reset customer points', success: false }, { status: 500 });
    }
  } catch (error: any) {
    console.error('POST /api/admin/reset/points error:', error);
    return NextResponse.json({ message: 'Error resetting customer points: ' + error.message, success: false }, { status: 500 });
  }
}
