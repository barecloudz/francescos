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

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();
    const { amount, orderId } = body;

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert dollars to cents
      currency: 'usd',
      metadata: {
        orderId: orderId?.toString() ?? '',
        userId: user?.id?.toString() ?? 'guest',
      },
    });

    // Link the Stripe payment intent to the order for later reconciliation
    if (orderId) {
      await storage.updateOrderPaymentIntent(orderId, paymentIntent.id);
    }

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('POST /api/create-payment-intent error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
