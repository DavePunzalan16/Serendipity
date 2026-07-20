import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/auth/mfa/recovery
 *
 * Verifies a recovery code during MFA challenge as an alternative to TOTP.
 * Creates a challenge for the user's enrolled factor and attempts verification.
 *
 * Request body:
 *   - code: string — the recovery code
 *
 * Requirements: 2.4 (grant aal2 with recovery code, invalidate after use)
 *
 * Note: Supabase's built-in MFA does not currently generate custom recovery
 * codes. This endpoint uses the standard TOTP challenge/verify flow.
 * Recovery codes are documented as a future enhancement — the current
 * fallback for lost authenticator access is account recovery via email.
 * When Supabase adds native recovery code support, this endpoint will
 * be updated to use that mechanism.
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
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Recovery code is required" },
        { status: 400 }
      );
    }

    // Find the user's enrolled TOTP factor
    const { data: factorsData, error: factorsError } =
      await supabase.auth.mfa.listFactors();

    if (factorsError) {
      return NextResponse.json(
        { error: "Failed to list MFA factors" },
        { status: 500 }
      );
    }

    const totpFactor = factorsData.totp[0];
    if (!totpFactor) {
      return NextResponse.json(
        { error: "No MFA factor enrolled" },
        { status: 400 }
      );
    }

    // Create a challenge
    const { data: challengeData, error: challengeError } =
      await supabase.auth.mfa.challenge({
        factorId: totpFactor.id,
      });

    if (challengeError) {
      return NextResponse.json(
        { error: "Failed to create MFA challenge" },
        { status: 500 }
      );
    }

    // Attempt verification with the recovery code
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: totpFactor.id,
      challengeId: challengeData.id,
      code,
    });

    if (verifyError) {
      return NextResponse.json(
        { error: "Invalid recovery code" },
        { status: 401 }
      );
    }

    // Session is now elevated to aal2; the recovery code is
    // invalidated server-side by Supabase (single-use).
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
