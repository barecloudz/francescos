import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET() {
  try {
    const orders = await storage.getActiveOrders();
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('GET /api/kitchen/orders error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
