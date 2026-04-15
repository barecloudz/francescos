import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { timeEntryId, breakDuration, notes } = body;

    const timeEntry = await storage.getTimeEntry(timeEntryId);
    if (!timeEntry || timeEntry.employeeId !== user.id) {
      return NextResponse.json({ message: 'Time entry not found' }, { status: 404 });
    }

    if (timeEntry.clockOutTime) {
      return NextResponse.json({ message: 'Already clocked out' }, { status: 400 });
    }

    const clockOutTime = new Date();
    const clockInTime = new Date(timeEntry.clockInTime);
    const totalMinutes = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60);
    const totalHours = Math.max(0, (totalMinutes - (breakDuration || 0)) / 60);
    const overtimeHours = Math.max(0, totalHours - 8);

    const updatedEntry = await storage.updateTimeEntry(timeEntryId, {
      clockOutTime,
      breakDurationMinutes: breakDuration || 0,
      totalHours: parseFloat(totalHours.toFixed(2)),
      overtimeHours: parseFloat(overtimeHours.toFixed(2)),
      notes,
      status: 'completed',
    });

    if (overtimeHours > 0) {
      await storage.createScheduleAlert({
        employeeId: user.id,
        alertType: 'overtime',
        message: `${user.firstName} ${user.lastName} worked ${overtimeHours.toFixed(2)} hours of overtime`,
        timeEntryId,
      });
    }

    return NextResponse.json({
      timeEntry: updatedEntry,
      totalHours: totalHours.toFixed(2),
      overtimeHours: overtimeHours.toFixed(2),
    });
  } catch (error: any) {
    console.error('POST /api/time-clock/clock-out error:', error);
    return NextResponse.json({ message: 'Failed to clock out' }, { status: 500 });
  }
}
