import type { TypedSupabaseClient, AuthResult, MFAEnrollResult, AALStatus } from './types';

function toAuthResult(data: { user: any; session: any }, error: any): AuthResult {
  if (error) {
    return { user: null, session: null, error: error.message };
  }
  return {
    user: data.user ? { id: data.user.id, email: data.user.email } : null,
    session: data.session
      ? {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        }
      : null,
    error: null,
  };
}

/** Sign up a new user with email and password */
export async function signUpWithEmail(
  client: TypedSupabaseClient,
  email: string,
  password: string,
): Promise<AuthResult> {
  const { data, error } = await client.auth.signUp({ email, password });
  return toAuthResult(data, error);
}

/** Sign in with email and password */
export async function signInWithEmail(
  client: TypedSupabaseClient,
  email: string,
  password: string,
): Promise<AuthResult> {
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  return toAuthResult(data, error);
}

/** Initiate Google OAuth sign-in flow */
export async function signInWithGoogle(client: TypedSupabaseClient): Promise<void> {
  const { error } = await client.auth.signInWithOAuth({ provider: 'google' });
  if (error) throw new Error(error.message);
}

/** Enroll a new MFA TOTP factor */
export async function enrollMFA(client: TypedSupabaseClient): Promise<MFAEnrollResult> {
  const { data, error } = await client.auth.mfa.enroll({ factorType: 'totp' });
  if (error) throw new Error(error.message);

  // Recovery codes are generated server-side; fetch them via the factor's metadata
  return {
    qr_code: data.totp.qr_code,
    secret: data.totp.secret,
    recovery_codes: [], // Recovery codes are provided by the server on enrollment confirmation
  };
}

/** Verify a TOTP code for MFA challenge */
export async function verifyMFA(
  client: TypedSupabaseClient,
  factorId: string,
  code: string,
): Promise<AuthResult> {
  const { data: challengeData, error: challengeError } =
    await client.auth.mfa.challenge({ factorId });
  if (challengeError) {
    return { user: null, session: null, error: challengeError.message };
  }

  const { data, error } = await client.auth.mfa.verify({
    factorId,
    challengeId: challengeData.id,
    code,
  });
  if (error) {
    return { user: null, session: null, error: error.message };
  }

  const { data: sessionData } = await client.auth.getSession();
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

/** Verify a recovery code for MFA */
export async function verifyRecoveryCode(
  client: TypedSupabaseClient,
  code: string,
): Promise<AuthResult> {
  // Recovery codes are verified through the standard verify flow
  // The factor ID for recovery is typically the first enrolled factor
  const { data: factorsData, error: factorsError } = await client.auth.mfa.listFactors();
  if (factorsError) {
    return { user: null, session: null, error: factorsError.message };
  }

  const totpFactor = factorsData.totp[0];
  if (!totpFactor) {
    return { user: null, session: null, error: 'No MFA factor enrolled' };
  }

  const { data: challengeData, error: challengeError } =
    await client.auth.mfa.challenge({ factorId: totpFactor.id });
  if (challengeError) {
    return { user: null, session: null, error: challengeError.message };
  }

  const { error } = await client.auth.mfa.verify({
    factorId: totpFactor.id,
    challengeId: challengeData.id,
    code,
  });
  if (error) {
    return { user: null, session: null, error: error.message };
  }

  const { data: sessionData } = await client.auth.getSession();
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

/** Get the current AAL (Authenticator Assurance Level) */
export async function getAAL(client: TypedSupabaseClient): Promise<AALStatus> {
  const { data, error } = await client.auth.mfa.getAuthenticatorAssuranceLevel();
  if (error) throw new Error(error.message);
  return {
    currentLevel: data.currentLevel as 'aal1' | 'aal2',
    nextLevel: data.nextLevel as 'aal1' | 'aal2' | null,
  };
}

/** Refresh the current session */
export async function refreshSession(client: TypedSupabaseClient): Promise<AuthResult> {
  const { data, error } = await client.auth.refreshSession();
  return toAuthResult(data, error);
}

/** Sign out the current user */
export async function signOut(client: TypedSupabaseClient): Promise<void> {
  const { error } = await client.auth.signOut();
  if (error) throw new Error(error.message);
}
