import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY environment variable is required');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });
}

interface Params { params: Promise<{ orderId: string }> }

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(request);
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 });
    }

    const { orderId } = await params;
    const body = await request.json();
    const { amount, reason } = body;

    const order = await storage.getOrderWithItems(parseInt(orderId));
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    if (!order.paymentIntentId) {
      return NextResponse.json({ message: 'Order has no payment to refund' }, { status: 400 });
    }

    const refundAmount = amount
      ? Math.round(amount * 100)
      : Math.round(parseFloat(order.total) * 100);

    const stripe = getStripe();
    const refund = await stripe.refunds.create({
      payment_intent: order.paymentIntentId,
      amount: refundAmount,
      reason: reason || 'requested_by_customer',
      metadata: {
        orderId: orderId.toString(),
        refundedBy: user.id.toString(),
      },
    });

    await storage.updateOrderRefund(parseInt(orderId), {
      refundId: refund.id,
      refundAmount: refundAmount / 100,
      refundReason: reason || 'requested_by_customer',
      refundedBy: user.id,
      refundedAt: new Date(),
    });

    // Cancel order on full refund
    if (refundAmount >= Math.round(parseFloat(order.total) * 100)) {
      await storage.updateOrderStatus(parseInt(orderId), 'cancelled');
    }

    return NextResponse.json({
      success: true,
      refund: { id: refund.id, amount: refundAmount / 100, status: refund.status },
    });
  } catch (error: any) {
    console.error('POST /api/admin/orders/[orderId]/refund error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
