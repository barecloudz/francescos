import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

interface Params { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    const orderId = parseInt(id);
    const updatedOrder = await storage.updateOrderStatus(orderId, status);

    if (!updatedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Award loyalty points when an order is completed
    if (status === 'completed' && updatedOrder.userId) {
      try {
        await storage.awardPointsForOrder(
          updatedOrder.userId,
          updatedOrder.id,
          parseFloat(updatedOrder.total)
        );
      } catch (pointsError: any) {
        console.error(`Failed to award points for order #${orderId}:`, pointsError.message);
      }
    }

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error('PATCH /api/orders/[id]/status error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
