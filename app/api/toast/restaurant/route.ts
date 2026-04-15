import { NextResponse } from 'next/server';
import { getRestaurant, getConfig, getDigitalSchedule } from '@/lib/toast-api';

/**
 * GET /api/toast/restaurant
 * Returns restaurant info, service config, and online ordering schedule from Toast.
 */
export async function GET() {
  try {
    const [restaurant, config, schedule] = await Promise.allSettled([
      getRestaurant(),
      getConfig(),
      getDigitalSchedule(),
    ]);

    return NextResponse.json({
      restaurant: restaurant.status === 'fulfilled' ? restaurant.value : null,
      config: config.status === 'fulfilled' ? config.value : null,
      schedule: schedule.status === 'fulfilled' ? schedule.value : null,
      errors: [
        restaurant.status === 'rejected' ? `restaurant: ${restaurant.reason?.message}` : null,
        config.status === 'rejected' ? `config: ${config.reason?.message}` : null,
        schedule.status === 'rejected' ? `schedule: ${schedule.reason?.message}` : null,
      ].filter(Boolean),
    });
  } catch (error: any) {
    console.error('[Toast] Restaurant fetch error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
