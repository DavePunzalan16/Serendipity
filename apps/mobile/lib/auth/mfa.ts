import { getSupabaseClient } from "../supabase";
import type { AuthResult } from "@wander/api-client";

/**
 * MFA (Multi-Factor Authentication) module for mobile.
 *
 * Provides TOTP enrollment, challenge creation, code verification,
 * and recovery code verification using the Supabase client singleton.
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4
 */

export interface MFAEnrollResponse {
  factor_id: string;
  qr_code: string;
  totp_uri: string;
}

export interface MFAChallengeResponse {
  challenge_id: string;
  factor_id: string;
}

/**
 * Initiates MFA enrollment by generating a new TOTP factor.
 * Returns QR code data and the factor ID for confirmation.
 *
 * Requirement 2.1: Generate TOTP secret and display QR code.
 */
export async function enrollMFA(): Promise<MFAEnrollResponse> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    factor_id: data.id,
    qr_code: data.totp.qr_code,
    totp_uri: data.totp.uri,
  };
}

/**
 * Creates an MFA challenge for the given factor (or the first enrolled factor).
 * Returns a challenge_id used for verification.
 *
 * Requirement 2.3: Present TOTP challenge after password login.
 */
export async function createMFAChallenge(
  factorId?: string
): Promise<MFAChallengeResponse> {
  const supabase = getSupabaseClient();

  // If no factor_id provided, find the first enrolled TOTP factor
  if (!factorId) {
    const { data: factorsData, error: factorsError } =
      await supabase.auth.mfa.listFactors();

    if (factorsError) {
      throw new Error(factorsError.message);
    }

    const totpFactor = factorsData.totp[0];
    if (!totpFactor) {
      throw new Error("No MFA factor enrolled");
    }

    factorId = totpFactor.id;
  }

  const { data, error } = await supabase.auth.mfa.challenge({
    factorId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    challenge_id: data.id,
    factor_id: factorId,
  };
}

/**
 * Verifies a TOTP code against an active MFA challenge.
 * On success, the session is elevated to aal2.
 *
 * Requirement 2.1: Require valid TOTP code to confirm enrollment.
 * Requirement 2.3: Verify TOTP during login challenge.
 */
export async function verifyMFACode(
  factorId: string,
  challengeId: string,
  code: string
): Promise<AuthResult> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.auth.mfa.verify({
    factorId,
    challengeId,
    code,
  });

  if (error) {
    return { user: null, session: null, error: error.message };
  }

  // Session is now elevated to aal2; fetch updated session
  const { data: sessionData } = await supabase.auth.getSession();

  return {
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
    error: null,
  };
}

/**
 * Verifies a recovery code by using it as the TOTP code against
 * the user's enrolled factor. Creates a challenge and attempts verification.
 *
 * Requirement 2.4: Grant aal2 access and invalidate recovery code.
 *
 * Note: Supabase's built-in MFA does not currently generate custom recovery
 * codes. This function uses the standard TOTP verification flow. Recovery
 * codes are documented as a future enhancement, with account recovery email
 * as the current fallback for lost authenticator access.
 */
export async function verifyRecoveryCode(code: string): Promise<AuthResult> {
  const supabase = getSupabaseClient();

  // Get the user's first enrolled TOTP factor
  const { data: factorsData, error: factorsError } =
    await supabase.auth.mfa.listFactors();

  if (factorsError) {
    return { user: null, session: null, error: factorsError.message };
  }

  const totpFactor = factorsData.totp[0];
  if (!totpFactor) {
    return { user: null, session: null, error: "No MFA factor enrolled" };
  }

  // Create a challenge for the factor
  const { data: challengeData, error: challengeError } =
    await supabase.auth.mfa.challenge({ factorId: totpFactor.id });

  if (challengeError) {
    return { user: null, session: null, error: challengeError.message };
  }

  // Attempt to verify the recovery code
  const { error: verifyError } = await supabase.auth.mfa.verify({
    factorId: totpFactor.id,
    challengeId: challengeData.id,
    code,
  });

  if (verifyError) {
    return { user: null, session: null, error: verifyError.message };
  }

  // Session is now elevated to aal2; fetch updated session
  const { data: sessionData } = await supabase.auth.getSession();

  return {
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
    error: null,
  };
}

/**
 * Gets the current Authenticator Assurance Level for the session.
 * Returns currentLevel ('aal1' | 'aal2') and nextLevel if MFA is enrolled.
 */
export async function getAALStatus(): Promise<{
  currentLevel: "aal1" | "aal2";
  nextLevel: "aal1" | "aal2" | null;
}> {
  const supabase = getSupabaseClient();

  const { data, error } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (error) {
    throw new Error(error.message);
  }

  return {
    currentLevel: data.currentLevel as "aal1" | "aal2",
    nextLevel: data.nextLevel as "aal1" | "aal2" | null,
  };
}

/**
 * Lists all enrolled MFA factors for the current user.
 * Useful for checking if MFA is already enrolled before showing enrollment UI.
 */
export async function listMFAFactors(): Promise<{
  totp: Array<{ id: string; friendly_name?: string; status: string }>;
}> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.auth.mfa.listFactors();

  if (error) {
    throw new Error(error.message);
  }

  return {
    totp: data.totp.map((factor) => ({
      id: factor.id,
      friendly_name: factor.friendly_name ?? undefined,
      status: factor.status,
    })),
  };
}
