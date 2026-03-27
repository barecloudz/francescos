import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const zones = await storage.getDeliveryZones();
    const settings = await storage.getDeliverySettings();

    return NextResponse.json({
      zones,
      settings: settings || {
        restaurantAddress: '',
        maxDeliveryRadius: '10',
        distanceUnit: 'miles',
        isGoogleMapsEnabled: false,
        fallbackDeliveryFee: '5.00',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const newZone = await storage.createDeliveryZone(body);
    return NextResponse.json(newZone, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (body.type === 'settings') {
      const updatedSettings = await storage.updateDeliverySettings(body);
      return NextResponse.json(updatedSettings);
    } else {
      const updatedZone = await storage.updateDeliveryZone(body.id, body);
      return NextResponse.json(updatedZone);
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await storage.deleteDeliveryZone(body.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
