import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userRewardId, orderId } = body;

    const userReward = await storage.getUserReward(userRewardId);
    if (!userReward) {
      return NextResponse.json({ message: 'Reward not found' }, { status: 404 });
    }

    if (userReward.userId !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    if (userReward.isUsed) {
      return NextResponse.json({ message: 'Reward already used' }, { status: 400 });
    }

    const reward = await storage.getReward(userReward.rewardId);
    const order = await storage.getOrder(orderId);

    if (!reward || !order) {
      return NextResponse.json({ message: 'Reward or order not found' }, { status: 404 });
    }

    // Calculate discount amount based on reward type
    let discountAmount = 0;
    if (reward.discountType === 'percentage') {
      discountAmount = parseFloat(order.total.toString()) * (parseFloat(reward.discount.toString()) / 100);
    } else {
      discountAmount = parseFloat(reward.discount.toString());
    }

    // Enforce minimum order amount
    if (reward.minOrderAmount && parseFloat(order.total.toString()) < parseFloat(reward.minOrderAmount.toString())) {
      return NextResponse.json({
        message: `Order total must be at least $${reward.minOrderAmount} to use this reward`,
      }, { status: 400 });
    }

    const newTotal = parseFloat(order.total.toString()) - discountAmount;
    await storage.updateOrderTotal(orderId, newTotal);
    await storage.useUserReward(userRewardId);

    const updatedOrder = await storage.getOrder(orderId);
    return NextResponse.json({ order: updatedOrder, discount: discountAmount });
  } catch (error: any) {
    console.error('POST /api/rewards/apply error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
