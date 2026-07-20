import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/auth/mfa/challenge
 *
 * Creates an MFA challenge for the user's enrolled TOTP factor.
 * Returns a challenge_id that must be used when verifying the TOTP code.
 *
 * The client can optionally pass a specific factor_id in the request body.
 * If none is provided, the first enrolled TOTP factor is used.
 *
 * Requirements: 2.3 (present TOTP challenge after password login)
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Verify user is authenticated
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

    // Parse optional factor_id from body
    let factorId: string | undefined;
    try {
      const body = await request.json();
      factorId = body.factor_id;
    } catch {
      // Body is optional; if parsing fails, we'll use the first factor
    }

    // If no factor_id provided, find the user's first enrolled TOTP factor
    if (!factorId) {
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

      factorId = totpFactor.id;
    }

    // Create a challenge for the factor
    const { data, error } = await supabase.auth.mfa.challenge({
      factorId,
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to create MFA challenge" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      challenge_id: data.id,
      factor_id: factorId,
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
