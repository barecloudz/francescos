import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { getAuthUser } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const transactions = await db.execute(sql`
      SELECT
        pt.id,
        pt.user_id as "userId",
        pt.order_id as "orderId",
        pt.type,
        pt.points,
        pt.description,
        pt.order_amount as "orderAmount",
        pt.created_at as "createdAt",
        COALESCE(
          u.first_name || ' ' || u.last_name,
          su.first_name || ' ' || su.last_name,
          'Unknown User'
        ) as "userName",
        COALESCE(u.email, su.email) as "userEmail"
      FROM points_transactions pt
      LEFT JOIN users u ON pt.user_id = u.id
      LEFT JOIN users su ON pt.supabase_user_id = su.supabase_user_id
      ORDER BY pt.created_at DESC
      LIMIT 500
    `);

    return NextResponse.json(transactions.rows);
  } catch (error: any) {
    console.error('GET /api/admin/points-transactions error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
