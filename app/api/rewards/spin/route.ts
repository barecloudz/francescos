import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertUserRewardSchema } from '@shared/schema';
import { getAuthUser } from '@/lib/api-utils';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const allRewards = await storage.getAllRewards();
    if (allRewards.length === 0) {
      return NextResponse.json({ message: 'No rewards available' }, { status: 404 });
    }

    // Pick a random reward from active rewards
    const randomIndex = Math.floor(Math.random() * allRewards.length);
    const randomReward = allRewards[randomIndex];

    const userRewardData = {
      userId: user.id,
      rewardId: randomReward.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };

    const validatedData = insertUserRewardSchema.parse(userRewardData);
    const userReward = await storage.createUserReward(validatedData);

    return NextResponse.json({ userReward, reward: randomReward });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    console.error('POST /api/rewards/spin error:', error);
    return NextResponse.json({ message: 'Failed to spin reward wheel' }, { status: 500 });
  }
}
