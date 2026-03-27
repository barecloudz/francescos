import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

interface Params { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const order = await storage.getOrder(parseInt(id));

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Only allow the order owner or an admin to view the order
    if (order.userId !== user.id && !user.isAdmin) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.error('GET /api/orders/[id] error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!user.isAdmin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const numericId = parseInt(id);
    const order = await storage.getOrder(numericId);

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    const deleted = await storage.deleteOrder(numericId);
    if (!deleted) {
      return NextResponse.json({ message: 'Failed to delete order' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error: any) {
    console.error('DELETE /api/orders/[id] error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
