import { NextResponse } from 'next/server';
import { getStock } from '@/lib/toast-api';

/**
 * GET /api/toast/stock
 * Returns current item availability (what's 86'd / out of stock).
 */
export async function GET() {
  try {
    const stock = await getStock();
    return NextResponse.json(stock);
  } catch (error: any) {
    console.error('[Toast] Stock fetch error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
