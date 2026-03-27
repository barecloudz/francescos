import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { shipdayService } from '@/server/shipday';
import { getAuthUser } from '@/lib/api-utils';

interface Params { params: Promise<{ orderId: string }> }

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await params;
    const numericId = parseInt(orderId);

    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const order = await storage.getOrder(numericId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!order.shipdayOrderId) {
      return NextResponse.json({ error: 'Order does not have ShipDay tracking' }, { status: 404 });
    }

    const status = await shipdayService.getOrderStatus(order.shipdayOrderId);
    return NextResponse.json(status);
  } catch (error: any) {
    console.error('GET /api/admin/orders/[orderId]/shipday-status error:', error);
    return NextResponse.json({ error: 'Failed to get ShipDay status' }, { status: 500 });
  }
}
