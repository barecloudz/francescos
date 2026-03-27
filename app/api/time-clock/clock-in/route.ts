import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    // Block double clock-in
    const activeEntry = await storage.getActiveTimeEntry(user.id);
    if (activeEntry) {
      return NextResponse.json({ message: 'You are already clocked in', activeEntry }, { status: 400 });
    }

    const todaysSchedule = await storage.getTodaysSchedule(user.id);
    const currentTime = new Date();
    let scheduleAlert = null;

    if (todaysSchedule) {
      const scheduleStart = new Date(`${todaysSchedule.scheduleDate}T${todaysSchedule.startTime}`);
      const timeDiff = (currentTime.getTime() - scheduleStart.getTime()) / (1000 * 60); // minutes

      if (timeDiff < -15) {
        scheduleAlert = await storage.createScheduleAlert({
          employeeId: user.id,
          alertType: 'early_clock_in',
          message: `${user.firstName} ${user.lastName} clocked in ${Math.abs(timeDiff).toFixed(0)} minutes early`,
          scheduledShiftId: todaysSchedule.id,
        });
      } else if (timeDiff > 15) {
        scheduleAlert = await storage.createScheduleAlert({
          employeeId: user.id,
          alertType: 'late_clock_in',
          message: `${user.firstName} ${user.lastName} clocked in ${timeDiff.toFixed(0)} minutes late`,
          scheduledShiftId: todaysSchedule.id,
        });
      }
    } else {
      scheduleAlert = await storage.createScheduleAlert({
        employeeId: user.id,
        alertType: 'unscheduled_clock_in',
        message: `${user.firstName} ${user.lastName} clocked in without a scheduled shift`,
      });
    }

    const timeEntry = await storage.createTimeEntry({
      employeeId: user.id,
      clockInTime: currentTime,
      scheduledShiftId: todaysSchedule?.id,
    });

    return NextResponse.json({ timeEntry, schedule: todaysSchedule, alert: scheduleAlert }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/time-clock/clock-in error:', error);
    return NextResponse.json({ message: 'Failed to clock in' }, { status: 500 });
  }
}
