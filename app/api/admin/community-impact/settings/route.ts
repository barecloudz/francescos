import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { communityImpactSettings } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { getAuthUser } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.isAdmin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const existing = await db.query.communityImpactSettings.findFirst();

    if (existing) {
      const updated = await db
        .update(communityImpactSettings)
        .set({
          comingSoon: body.comingSoon,
          pageTitle: body.pageTitle,
          pageDescription: body.pageDescription,
          monthlyGoal: body.monthlyGoal,
          updatedAt: new Date(),
        })
        .where(eq(communityImpactSettings.id, existing.id))
        .returning();
      return NextResponse.json(updated[0]);
    } else {
      const created = await db
        .insert(communityImpactSettings)
        .values({
          comingSoon: body.comingSoon !== false,
          pageTitle: body.pageTitle || 'Community Impact',
          pageDescription: body.pageDescription || '',
          monthlyGoal: body.monthlyGoal || null,
        })
        .returning();
      return NextResponse.json(created[0]);
    }
  } catch (error: any) {
    console.error('POST /api/admin/community-impact/settings error:', error);
    return NextResponse.json({ message: 'Failed to update settings', error: error.message }, { status: 500 });
  }
}
