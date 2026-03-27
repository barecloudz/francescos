import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/orders', '/profile', '/rewards', '/order-details', '/order-success', '/checkout'];

// Routes that require admin role
const ADMIN_ROUTES = ['/admin'];

// Routes that require any auth (employee or admin)
const EMPLOYEE_ROUTES = ['/kitchen', '/employee'];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — IMPORTANT: do not remove
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Check protected routes — redirect to /auth if not logged in
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAdmin = ADMIN_ROUTES.some(route => pathname.startsWith(route));
  const isEmployee = EMPLOYEE_ROUTES.some(route => pathname.startsWith(route));

  if ((isProtected || isAdmin || isEmployee) && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/auth';
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
