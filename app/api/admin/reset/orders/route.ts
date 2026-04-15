import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 401 });
    }

    console.log(`Admin ${user.email} initiated order reset`);
    const success = await storage.resetAllOrders();

    if (success) {
      return NextResponse.json({ message: 'All orders and order items have been deleted successfully', success: true });
    } else {
      return NextResponse.json({ message: 'Failed to reset orders', success: false }, { status: 500 });
    }
  } catch (error: any) {
    console.error('POST /api/admin/reset/orders error:', error);
    return NextResponse.json({ message: 'Error resetting orders: ' + error.message, success: false }, { status: 500 });
  }
}
