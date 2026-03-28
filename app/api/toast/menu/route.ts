import { NextResponse } from 'next/server';
import { getMenus } from '@/lib/toast-api';

/**
 * GET /api/toast/menu
 * Fetches the full menu from Toast and returns it raw.
 * Rate limit: 1 req/sec — do not call this on every page load.
 * Use the sync endpoint to push data into your DB instead.
 */
export async function GET() {
  try {
    const menus = await getMenus();
    return NextResponse.json(menus);
  } catch (error: any) {
    console.error('[Toast] Menu fetch error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
