import { NextRequest, NextResponse } from 'next/server';
import { getOrders, getOrdersBulk } from '@/lib/toast-api';

/**
 * GET /api/toast/orders?from=2026-03-01&to=2026-03-27&bulk=true
 * Fetches orders from Toast for a date range.
 * Use bulk=true for historical pulls (>1 hour). Max range for bulk: 1 month.
 * Without bulk: max 1 hour per request.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const bulk = searchParams.get('bulk') === 'true';

    if (!from || !to) {
      return NextResponse.json(
        { error: 'from and to query params required (YYYY-MM-DD or ISO 8601)' },
        { status: 400 }
      );
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    const orders = bulk
      ? await getOrdersBulk(fromDate, toDate)
      : await getOrders(fromDate, toDate);

    return NextResponse.json({ orders, count: Array.isArray(orders) ? orders.length : 0 });
  } catch (error: any) {
    console.error('[Toast] Orders fetch error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
