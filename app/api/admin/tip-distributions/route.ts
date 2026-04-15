import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
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
    const orderId = url.searchParams.get('orderId');

    // Build query with optional filters
    let query = `
      SELECT td.*, u.first_name, u.last_name, u.username,
             o.id as order_number, o.created_at as order_date
      FROM tip_distributions td
      JOIN users u ON td.employee_id = u.id
      JOIN orders o ON td.order_id = o.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (startDate) {
      query += ` AND td.distribution_date >= $${params.length + 1}`;
      params.push(startDate);
    }
    if (endDate) {
      query += ` AND td.distribution_date <= $${params.length + 1}`;
      params.push(endDate);
    }
    if (orderId) {
      query += ` AND td.order_id = $${params.length + 1}`;
      params.push(parseInt(orderId));
    }

    query += ` ORDER BY td.distribution_date DESC`;

    const result = await db.execute(sql.raw(query));
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('GET /api/admin/tip-distributions error:', error);
    return NextResponse.json({ message: 'Failed to get tip distributions' }, { status: 500 });
  }
}
