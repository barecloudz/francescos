import { NextRequest, NextResponse } from 'next/server';

// Simple credential check for the admin portal.
// Production auth goes through Supabase; this endpoint is a lightweight
// fallback used during local development and testing.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (username === 'admin' && password === 'admin123456') {
      return NextResponse.json({
        id: 1,
        username: 'admin',
        email: 'admin@francescos.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isAdmin: true,
        isActive: true,
        rewards: 0,
      });
    }

    return NextResponse.json({ message: 'Invalid admin credentials' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
