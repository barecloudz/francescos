import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { shipdayService } from '@/lib/shipday';

interface Params { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const order = await storage.getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Return basic progress when ShipDay tracking is not configured for this order
    if (!order.shipdayOrderId) {
      return NextResponse.json({
        status: 'no_tracking',
        statusDisplay: 'Tracking not available',
        progress: {
          ordered: true,
          preparing: order.status === 'pending' || order.status === 'confirmed',
          pickedUp: false,
          onTheWay: false,
          delivered: order.status === 'completed',
        },
      });
    }

    const trackingInfo = await shipdayService.getOrderTracking(order.shipdayOrderId);
    return NextResponse.json(trackingInfo);
  } catch (error: any) {
    console.error('GET /api/orders/[id]/tracking error:', error);
    return NextResponse.json({ error: 'Failed to get tracking information' }, { status: 500 });
  }
}
