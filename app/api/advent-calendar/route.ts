import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/api-utils';
import postgres from 'postgres';

function getSQL() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is required');
  return postgres(databaseUrl, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
    keep_alive: false,
  });
}

function getEST() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const est = new Date(utc + 3600000 * -5);
  return {
    year: est.getFullYear(),
    month: est.getMonth() + 1,
    day: est.getDate(),
  };
}

export async function GET(request: NextRequest) {
  const sql = getSQL();
  try {
    const { year, month, day } = getEST();

    const [animationSettings] = await sql`
      SELECT is_enabled, settings
      FROM animations_settings
      WHERE animation_key = 'advent_calendar'
      LIMIT 1
    `;

    if (!animationSettings?.is_enabled) {
      return NextResponse.json({ enabled: false, daysUntilChristmas: null, calendar: [] });
    }

    const christmas = new Date(year, 11, 25);
    const today = new Date(year, month - 1, day);
    const daysUntilChristmas = Math.max(0, Math.ceil((christmas.getTime() - today.getTime()) / 86400000));

    const calendarEntries = await sql`
      SELECT ac.id, ac.day, ac.reward_id, ac.is_active, ac.is_closed,
             r.name as reward_name, r.description as reward_description, r.image_url as reward_image
      FROM advent_calendar ac
      LEFT JOIN rewards r ON r.id = ac.reward_id
      WHERE ac.year = ${year} AND ac.is_active = true
      ORDER BY ac.day ASC
    `;

    const authUser = await getAuthUser(request);
    let userClaims: any[] = [];

    if (authUser) {
      userClaims = await sql`
        SELECT advent_day FROM advent_claims
        WHERE user_id = ${authUser.id} AND year = ${year}
      `;
    }

    const claimedDays = new Set(userClaims.map((c: any) => c.advent_day));

    const calendar = calendarEntries.map((entry: any) => {
      const isCurrentDay = month === 12 && day === entry.day;
      const isPastDay = month === 12 && day > entry.day;
      const isFutureDay = month < 12 || (month === 12 && day < entry.day);
      const isClaimed = claimedDays.has(entry.day);
      const isClosed = entry.is_closed || false;
      return {
        day: entry.day,
        rewardId: entry.reward_id,
        rewardName: entry.reward_name,
        rewardDescription: entry.reward_description,
        rewardImage: entry.reward_image,
        isCurrentDay,
        isPastDay,
        isFutureDay,
        isClaimed,
        isClosed,
        canClaim: isCurrentDay && !isClaimed && !isClosed && !!authUser,
      };
    });

    return NextResponse.json({
      enabled: true,
      daysUntilChristmas,
      isDecember: month === 12,
      currentDay: month === 12 ? day : null,
      calendar,
      isAuthenticated: !!authUser,
      isAdmin: authUser?.isAdmin ?? false,
    });
  } catch (error: any) {
    console.error('GET /api/advent-calendar error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await sql.end();
  }
}

export async function POST(request: NextRequest) {
  const sql = getSQL();
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Authentication required to claim rewards' }, { status: 401 });
    }

    const { year, month, day: currentDay } = getEST();
    const { day } = await request.json();

    if (!day || day < 1 || day > 25) {
      return NextResponse.json({ error: 'Invalid day. Must be between 1 and 25.' }, { status: 400 });
    }

    if (month !== 12 || currentDay !== day) {
      return NextResponse.json({ error: `This reward is only available on December ${day}` }, { status: 400 });
    }

    const existing = await sql`
      SELECT id FROM advent_claims
      WHERE user_id = ${authUser.id} AND advent_day = ${day} AND year = ${year}
    `;
    if (existing.length > 0) {
      return NextResponse.json({ error: 'You have already claimed this reward' }, { status: 400 });
    }

    const [calendarEntry] = await sql`
      SELECT id, reward_id FROM advent_calendar
      WHERE day = ${day} AND year = ${year} AND is_active = true LIMIT 1
    `;
    if (!calendarEntry?.reward_id) {
      return NextResponse.json({ error: 'No reward available for this day' }, { status: 404 });
    }

    const [reward] = await sql`
      SELECT id, name, description, voucher_code,
             COALESCE(discount, discount_amount, 0) as discount_amount,
             discount_type, min_order_amount, reward_type, bonus_points
      FROM rewards WHERE id = ${calendarEntry.reward_id} LIMIT 1
    `;
    if (!reward) {
      return NextResponse.json({ error: 'Reward not found' }, { status: 404 });
    }

    if (reward.reward_type === 'bonus_points' && reward.bonus_points > 0) {
      const [currentUser] = await sql`SELECT rewards FROM users WHERE id = ${authUser.id}`;
      const newPoints = (currentUser?.rewards || 0) + reward.bonus_points;
      await sql`UPDATE users SET rewards = ${newPoints} WHERE id = ${authUser.id}`;
      await sql`
        INSERT INTO points_transactions (user_id, type, points, description, created_at)
        VALUES (${authUser.id}, 'bonus', ${reward.bonus_points}, ${'🎄 Christmas Present - ' + reward.name}, NOW())
      `;
      await sql`
        INSERT INTO advent_claims (user_id, advent_day, reward_id, voucher_id, year)
        VALUES (${authUser.id}, ${day}, ${reward.id}, ${null}, ${year})
      `;
      return NextResponse.json({
        success: true,
        message: `You've claimed ${reward.bonus_points} bonus points for December ${day}!`,
        reward: { name: reward.name, description: reward.description, bonusPoints: reward.bonus_points, newTotal: newPoints },
      });
    }

    const voucherCode = reward.voucher_code || `XMAS${year}-DAY${day}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const expirationDate = new Date(Date.UTC(year, 11, day + 1, 4, 59, 59));

    const [voucher] = await sql`
      INSERT INTO user_vouchers (user_id, reward_id, voucher_code, discount_amount, discount_type,
        min_order_amount, points_used, status, title, description, expires_at)
      VALUES (${authUser.id}, ${reward.id}, ${voucherCode}, ${reward.discount_amount || 0},
        ${reward.discount_type || 'fixed'}, ${reward.min_order_amount || 0}, 0, 'active',
        ${'🎄 Christmas Present - ' + reward.name}, ${reward.description}, ${expirationDate.toISOString()})
      RETURNING id
    `;
    await sql`
      INSERT INTO advent_claims (user_id, advent_day, reward_id, voucher_id, year)
      VALUES (${authUser.id}, ${day}, ${reward.id}, ${voucher.id}, ${year})
    `;

    return NextResponse.json({
      success: true,
      message: `You've claimed your reward for December ${day}!`,
      reward: { name: reward.name, description: reward.description, voucherId: voucher.id },
    });
  } catch (error: any) {
    console.error('POST /api/advent-calendar error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await sql.end();
  }
}

export async function DELETE(request: NextRequest) {
  const sql = getSQL();
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    if (!authUser.isAdmin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });

    const { year } = getEST();
    const { day } = await request.json();

    if (!day || day < 1 || day > 25) {
      return NextResponse.json({ error: 'Invalid day. Must be between 1 and 25.' }, { status: 400 });
    }

    const claim = await sql`
      SELECT id, voucher_id FROM advent_claims
      WHERE user_id = ${authUser.id} AND advent_day = ${day} AND year = ${year}
    `;
    if (claim.length === 0) {
      return NextResponse.json({ error: 'No claim found for this day' }, { status: 404 });
    }

    if (claim[0].voucher_id) {
      await sql`DELETE FROM user_vouchers WHERE id = ${claim[0].voucher_id}`;
    }
    await sql`DELETE FROM advent_claims WHERE id = ${claim[0].id}`;

    return NextResponse.json({ success: true, message: `Claim for December ${day} has been reset.` });
  } catch (error: any) {
    console.error('DELETE /api/advent-calendar error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await sql.end();
  }
}
