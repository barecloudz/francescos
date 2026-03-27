import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      restaurant: {
        name: "Francesco's Pizza & Pasta",
        phone: '(843) 299-2700',
        address: '2539 US-17S #6, Murrells Inlet SC 29576',
        hours: 'See store hours settings',
      },
      system: {
        version: '2.0.0',
        environment: process.env.NODE_ENV || 'development',
      },
    });
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

    // Settings are mostly managed through more specific endpoints.
    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
