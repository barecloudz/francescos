import { createSupabaseServerClient } from './supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { storage } from '@/lib/storage';

// Service-role Supabase client for verifying Bearer tokens from the Authorization header.
// This is used when the frontend sends a JWT directly (not via cookies).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  isAdmin: boolean;
  supabaseUserId: string;
}

/**
 * Resolve the authenticated application user from the incoming request.
 *
 * Resolution order:
 * 1. Authorization: Bearer <token> header — verified with Supabase Admin client.
 * 2. Supabase session cookie — verified with the SSR server client.
 *
 * On success the function returns the matching row from our `users` table (creating
 * it automatically on first Google / Supabase OAuth login).  Returns null when no
 * valid credential is present.
 */
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  // --- Path 1: Bearer token ---
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ') && supabaseAdmin) {
    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (!error && user) {
      return resolveDbUser(user);
    }
  }

  // --- Path 2: Session cookie ---
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return resolveDbUser(user);
    }
  } catch {
    // Cookie store not available in this context — fall through.
  }

  return null;
}

/**
 * Look up (or lazily create) the application-level user record for a Supabase auth user.
 */
async function resolveDbUser(user: any): Promise<AuthUser | null> {
  try {
    let dbUser = await storage.getUserBySupabaseId(user.id);

    if (!dbUser) {
      dbUser = await storage.createUser({
        username: user.email?.split('@')[0] || `supabase_${user.id}`,
        email: user.email || '',
        firstName: user.user_metadata?.full_name?.split(' ')[0] || '',
        lastName: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
        password: '',
        supabaseUserId: user.id,
        role: 'customer',
        isActive: true,
        marketingOptIn: user.user_metadata?.marketing_opt_in !== false,
      });
      await storage.updateUserPoints(dbUser.id, 0, 0, 0);
    }

    return {
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      username: dbUser.username,
      role: dbUser.role,
      isAdmin: dbUser.isAdmin,
      supabaseUserId: user.id,
    };
  } catch {
    return null;
  }
}

/** Return a standard JSON error response. */
export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message, message }, { status });
}

/** Return a standard JSON success response. */
export function successResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
}
