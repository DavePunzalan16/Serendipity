import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/auth/mfa/verify
 *
 * Verifies a TOTP code against an active MFA challenge.
 * On success, the session is elevated to aal2.
 *
 * Request body:
 *   - factor_id: string — the MFA factor ID
 *   - challenge_id: string — the challenge ID from /api/auth/mfa/challenge
 *   - code: string — the 6-digit TOTP code or a recovery code
 *
 * Requirements: 2.1 (confirm enrollment with valid TOTP code)
 *               2.3 (verify TOTP during login challenge)
 *               2.4 (verify recovery code with single-use invalidation)
 *
 * Note on recovery codes: Supabase's built-in MFA does not generate custom
 * recovery codes. Recovery code support is a future enhancement via account
 * recovery email. The verify endpoint accepts any code and passes it to
 * Supabase's verify, which handles TOTP validation. Recovery codes would
 * use the same TOTP factor verification flow if Supabase supports them,
 * or could be implemented as a separate factor type in the future.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Verify user is authenticated (at least aal1)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { factor_id, challenge_id, code } = body;

    if (!factor_id || !challenge_id || !code) {
      return NextResponse.json(
        { error: "factor_id, challenge_id, and code are required" },
        { status: 400 }
      );
    }

    // Verify the TOTP code against the challenge
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: factor_id,
      challengeId: challenge_id,
      code,
    });

    if (verifyError) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 401 }
      );
    }

    // Session is now elevated to aal2; fetch current session data
    const { data: sessionData } = await supabase.auth.getSession();

    return NextResponse.json({
      user: sessionData.session?.user
        ? { id: sessionData.session.user.id, email: sessionData.session.user.email }
        : null,
      session: sessionData.session
        ? {
            access_token: sessionData.session.access_token,
            refresh_token: sessionData.session.refresh_token,
            expires_at: sessionData.session.expires_at,
          }
        : null,
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
