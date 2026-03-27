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

    const vouchers = await db.execute(sql`
      SELECT
        uv.id,
        uv.user_id as "userId",
        uv.voucher_code as "voucherCode",
        uv.points_used as "pointsUsed",
        uv.discount_amount as "discountAmount",
        uv.discount_type as "discountType",
        uv.status,
        uv.applied_to_order_id as "appliedToOrderId",
        uv.created_at as "createdAt",
        uv.used_at as "usedAt",
        uv.expires_at as "expiresAt",
        uv.title,
        uv.description,
        COALESCE(
          u.first_name || ' ' || u.last_name,
          su.first_name || ' ' || su.last_name,
          'Unknown User'
        ) as "userName",
        COALESCE(u.email, su.email) as "userEmail",
        r.name as "rewardName"
      FROM user_vouchers uv
      LEFT JOIN users u ON uv.user_id = u.id
      LEFT JOIN users su ON uv.supabase_user_id = su.supabase_user_id
      LEFT JOIN rewards r ON uv.reward_id = r.id
      ORDER BY uv.created_at DESC
      LIMIT 500
    `);

    return NextResponse.json(vouchers.rows);
  } catch (error: any) {
    console.error('GET /api/admin/voucher-usage error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
