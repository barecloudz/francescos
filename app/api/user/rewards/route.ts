import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userPoints = await storage.getUserPoints(user.id);

    return NextResponse.json({
      points: userPoints?.points || 0,
      totalPointsEarned: userPoints?.totalEarned || 0,
      totalPointsRedeemed: userPoints?.totalRedeemed || 0,
      lastEarnedAt: userPoints?.lastEarnedAt,
    });
  } catch (error: any) {
    console.error('GET /api/user/rewards error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
