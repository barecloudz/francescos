import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function GET(request: NextRequest) {
  try {
    const deliverySettings = await storage.getDeliverySettings();
    const vacationMode = await storage.getVacationMode();

    const isAvailable = !vacationMode?.isEnabled && (deliverySettings?.isGoogleMapsEnabled ?? false);

    return NextResponse.json({
      isAvailable,
      fallbackDeliveryFee: deliverySettings?.fallbackDeliveryFee ?? '5.00',
      maxDeliveryRadius: deliverySettings?.maxDeliveryRadius ?? '10',
      distanceUnit: deliverySettings?.distanceUnit ?? 'miles',
    });
  } catch (error: any) {
    console.error('GET /api/delivery-availability error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
