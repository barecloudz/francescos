import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const redemptions = await storage.getUserRedemptions(user.id);
    return NextResponse.json(redemptions);
  } catch (error: any) {
    console.error('GET /api/user/redemptions error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
