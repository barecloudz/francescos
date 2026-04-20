import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getAuthUser } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await storage.getUser(authUser.id);
    if (!dbUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: dbUser.id,
      email: dbUser.email,
      username: dbUser.username,
      first_name: dbUser.firstName,
      last_name: dbUser.lastName,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      phone: dbUser.phone,
      address: dbUser.address,
      city: dbUser.city,
      state: dbUser.state,
      zip_code: dbUser.zipCode,
      zipCode: dbUser.zipCode,
      role: dbUser.role,
      is_admin: dbUser.isAdmin,
      isAdmin: dbUser.isAdmin,
      supabase_user_id: dbUser.supabaseUserId,
      isGoogleUser: !!dbUser.googleId || (!!dbUser.supabaseUserId && !dbUser.password),
      marketingOptIn: dbUser.marketingOptIn,
      createdAt: dbUser.createdAt,
    });
  } catch (error: any) {
    console.error('GET /api/user-profile error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, email, phone, address, city, state, zipCode } = body;

    const updatedUser = await storage.updateUser(authUser.id, {
      ...(firstName !== undefined && { firstName }),
      ...(lastName !== undefined && { lastName }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone }),
      ...(address !== undefined && { address }),
      ...(city !== undefined && { city }),
      ...(state !== undefined && { state }),
      ...(zipCode !== undefined && { zipCode }),
    });

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      first_name: updatedUser.firstName,
      last_name: updatedUser.lastName,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      phone: updatedUser.phone,
      address: updatedUser.address,
      city: updatedUser.city,
      state: updatedUser.state,
      zip_code: updatedUser.zipCode,
      zipCode: updatedUser.zipCode,
      role: updatedUser.role,
      is_admin: updatedUser.isAdmin,
      isAdmin: updatedUser.isAdmin,
      supabase_user_id: updatedUser.supabaseUserId,
    });
  } catch (error: any) {
    console.error('PATCH /api/user-profile error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
