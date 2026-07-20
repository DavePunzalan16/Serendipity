import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Middleware for AAL (Authenticator Assurance Level) checking and session refresh.
 *
 * Responsibilities:
 * - Refresh Supabase session tokens on each request
 * - Protect routes under /(main)/ and /api/ (except public endpoints)
 * - Redirect unauthenticated users to /login
 * - Redirect users with insufficient AAL to /mfa-challenge
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // TODO: Refresh session — this call also refreshes expired tokens
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // TODO: If no session and accessing protected route, redirect to login
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // TODO: Check AAL level for MFA enforcement
  // const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  // if (aalData?.currentLevel === 'aal1' && aalData?.nextLevel === 'aal2') {
  //   // User has MFA enrolled but hasn't completed challenge this session
  //   const mfaUrl = new URL('/mfa-challenge', request.url);
  //   return NextResponse.redirect(mfaUrl);
  // }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match routes under /(main)/ and /api/ except:
     * - /api/auth/** (public auth callback endpoints)
     * - _next/static, _next/image, favicon.ico (Next.js internals)
     */
    "/(main)/:path*",
    "/api/((?!auth).*)",
  ],
};
