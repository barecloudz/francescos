import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/api-utils';

// Called by the frontend when a user profile fetch fails on first login.
// getAuthUser already auto-creates the DB record via resolveDbUser, so just
// calling it here is sufficient to ensure the user row exists.
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ success: true, id: authUser.id });
  } catch (error: any) {
    console.error('POST /api/create-current-user error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
