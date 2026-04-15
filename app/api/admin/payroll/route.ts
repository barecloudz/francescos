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
    const payPeriodId = url.searchParams.get('payPeriodId');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    const payrollData = await storage.getPayrollSummary(
      payPeriodId ? parseInt(payPeriodId) : undefined,
      startDate ?? undefined,
      endDate ?? undefined
    );

    return NextResponse.json(payrollData);
  } catch (error: any) {
    console.error('GET /api/admin/payroll error:', error);
    return NextResponse.json({ message: 'Failed to get payroll data' }, { status: 500 });
  }
}
