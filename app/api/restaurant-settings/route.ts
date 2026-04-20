import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

const DEFAULT_SETTINGS = {
  restaurantName: "Francesco's Pizza Kitchen",
  address: '2520 US-17 BUS, Murrells Inlet, SC 29576',
  phone: '(843) 357-9990',
  email: 'info@francescosmurrellsinlet.com',
  hours: 'Mon-Thu 11am-9pm, Fri-Sat 11am-10pm, Sun 12pm-9pm',
  isOpen: true,
};

export async function GET() {
  try {
    const settings = await storage.getRestaurantSettings();
    return NextResponse.json(settings || DEFAULT_SETTINGS);
  } catch {
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updated = await storage.updateRestaurantSettings(body);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
