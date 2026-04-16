import { NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { checkStoreStatus } from '@/api/utils/store-hours-utils';

export async function GET() {
  try {
    const hours = await storage.getAllStoreHours();

    if (!hours || hours.length === 0) {
      return NextResponse.json({
        isOpen: false,
        isPastCutoff: true,
        message: 'Store hours not configured',
        canPlaceAsapOrders: false,
      });
    }

    const status = checkStoreStatus(hours as any);

    return NextResponse.json({
      isOpen: status.isOpen,
      isPastCutoff: status.isPastCutoff,
      message: status.message,
      canPlaceAsapOrders: status.isOpen && !status.isPastCutoff,
      currentTime: status.currentTime,
      minutesUntilClose: status.minutesUntilClose,
      storeHours: status.storeHours,
      nextOpenTime: status.nextOpenTime,
    });
  } catch (error: any) {
    console.error('GET /api/store-status error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
