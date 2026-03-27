import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

interface Params { params: Promise<{ dayOfWeek: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { dayOfWeek } = await params;
    const body = await request.json();
    const { isOpen, openTime, closeTime, isBreakTime, breakStartTime, breakEndTime } = body;

    const updated = await storage.updateStoreHours(parseInt(dayOfWeek), {
      isOpen,
      openTime,
      closeTime,
      isBreakTime,
      breakStartTime,
      breakEndTime,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
