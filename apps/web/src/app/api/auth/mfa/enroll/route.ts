import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/auth/mfa/enroll
 *
 * Initiates MFA enrollment by generating a TOTP factor.
 * Returns the QR code (SVG data URI), TOTP URI, and factor ID
 * so the client can display the QR and prompt for a confirmation code.
 *
 * Requirements: 2.1 (generate TOTP secret, display QR code)
 */
export async function POST() {
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

    // Enroll a new TOTP factor
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to enroll MFA" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      factor_id: data.id,
      qr_code: data.totp.qr_code,
      totp_uri: data.totp.uri,
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
