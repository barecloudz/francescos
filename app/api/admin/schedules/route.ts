import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 401 });
    }

    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const employeeId = url.searchParams.get('employeeId');

    const schedules = await storage.getEmployeeSchedules(
      startDate ?? undefined,
      endDate ?? undefined,
      employeeId ? parseInt(employeeId) : undefined
    );

    return NextResponse.json(schedules);
  } catch (error: any) {
    console.error('GET /api/admin/schedules error:', error);
    return NextResponse.json({ message: 'Failed to get schedules' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 401 });
    }

    const scheduleData = await request.json();

    const conflicts = await storage.checkScheduleConflicts(
      scheduleData.employeeId,
      scheduleData.scheduleDate,
      scheduleData.startTime,
      scheduleData.endTime
    );

    if (conflicts.length > 0) {
      return NextResponse.json({ message: 'Scheduling conflict detected', conflicts }, { status: 400 });
    }

    const schedule = await storage.createEmployeeSchedule({
      ...scheduleData,
      createdBy: user.id,
    });

    return NextResponse.json(schedule, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/admin/schedules error:', error);
    return NextResponse.json({ message: 'Failed to create schedule' }, { status: 500 });
  }
}
