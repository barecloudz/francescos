import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

// The Stripe webhook uses the raw request body for signature verification.
// In Next.js App Router we use request.text() to get the raw body.
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    switch (payload.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = payload.data.object;
        if (paymentIntent.metadata?.orderId) {
          const orderId = parseInt(paymentIntent.metadata.orderId);
          await storage.updateOrderPaymentStatus(orderId, 'paid');
        }
        break;
      }
      default:
        console.log(`Unhandled Stripe event type: ${payload.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('POST /api/webhook error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
