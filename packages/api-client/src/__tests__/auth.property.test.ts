import * as fc from 'fast-check';
import { describe, it, expect } from 'vitest';

// --- Pure auth logic functions extracted from middleware/auth behavior ---

type AALevel = 'aal1' | 'aal2';

interface Session {
  userId: string;
  currentLevel: AALevel;
  nextLevel: AALevel | null;
}

interface RouteCheckParams {
  session: Session | null;
  routeRequiresAuth: boolean;
  routeRequiresAal2: boolean;
}

type RouteCheckResult =
  | { action: 'allow' }
  | { action: 'redirect'; target: 'login' | 'mfa-challenge' }
  | { action: 'reject'; status: 401 };

/**
 * Determines the middleware action for a given session and route requirements.
 * Mirrors the logic in apps/web/src/middleware.ts:
 * - No session on protected route → redirect to login
 * - Session at aal1 when aal2 required → redirect to MFA challenge
 * - Otherwise → allow
 */
function checkRouteAccess(params: RouteCheckParams): RouteCheckResult {
  if (!params.session) {
    if (params.routeRequiresAuth) {
      return { action: 'redirect', target: 'login' };
    }
    return { action: 'allow' };
  }

  // Session exists but needs higher AAL
  if (
    params.routeRequiresAal2 &&
    params.session.currentLevel === 'aal1' &&
    params.session.nextLevel === 'aal2'
  ) {
    return { action: 'redirect', target: 'mfa-challenge' };
  }

  return { action: 'allow' };
}

// --- Recovery code logic ---

interface RecoveryCodeStore {
  codes: Map<string, boolean>; // code → used
}

/**
 * Creates a fresh set of recovery codes (all marked as unused).
 */
function createRecoveryCodes(codes: string[]): RecoveryCodeStore {
  const store: RecoveryCodeStore = { codes: new Map() };
  for (const code of codes) {
    store.codes.set(code, false);
  }
  return store;
}

/**
 * Attempts to use a recovery code. Returns whether the code was accepted.
 * A valid, unused code grants access and is then invalidated (marked used).
 * An already-used code or invalid code is rejected.
 */
function useRecoveryCode(
  store: RecoveryCodeStore,
  code: string,
): { granted: boolean; store: RecoveryCodeStore } {
  const isValid = store.codes.has(code);
  if (!isValid) {
    return { granted: false, store };
  }

  const isUsed = store.codes.get(code)!;
  if (isUsed) {
    return { granted: false, store };
  }

  // Mark as used and grant access
  const updatedStore: RecoveryCodeStore = {
    codes: new Map(store.codes),
  };
  updatedStore.codes.set(code, true);
  return { granted: true, store: updatedStore };
}

// --- API authentication check ---

interface ApiRequest {
  sessionToken: string | null;
  endpoint: string;
}

interface ApiAuthResult {
  status: number;
  error?: string;
  data?: unknown;
}

/**
 * Simulates API authentication middleware.
 * Any request to an authenticated endpoint without a valid session token
 * receives a 401 response with a descriptive error code.
 */
function checkApiAuth(request: ApiRequest): ApiAuthResult {
  if (!request.sessionToken) {
    return { status: 401, error: 'AUTH_REQUIRED' };
  }

  // Simulate that a non-empty token is "valid" for this pure logic test
  return { status: 200, data: {} };
}

// --- Login error opacity ---

interface LoginAttempt {
  email: string;
  password: string;
}

interface UserDatabase {
  existingEmails: Set<string>;
  correctPasswords: Map<string, string>; // email → correct password
}

/**
 * Simulates login authentication logic.
 * The key requirement: the error message MUST be identical regardless of whether
 * the email exists or not (prevents email enumeration).
 */
function attemptLogin(
  db: UserDatabase,
  attempt: LoginAttempt,
): { success: boolean; error: string | null } {
  const GENERIC_ERROR = 'Invalid login credentials';

  const emailExists = db.existingEmails.has(attempt.email);

  if (!emailExists) {
    // Email does not exist, but we return the SAME error
    return { success: false, error: GENERIC_ERROR };
  }

  const correctPassword = db.correctPasswords.get(attempt.email);
  if (correctPassword !== attempt.password) {
    // Wrong password, but same error message
    return { success: false, error: GENERIC_ERROR };
  }

  return { success: true, error: null };
}

// --- Arbitraries ---

const aalLevelArb: fc.Arbitrary<AALevel> = fc.constantFrom('aal1', 'aal2');

const sessionArb: fc.Arbitrary<Session> = fc.record({
  userId: fc.uuid(),
  currentLevel: aalLevelArb,
  nextLevel: fc.oneof(aalLevelArb, fc.constant(null as AALevel | null)),
});

const recoveryCodeArb: fc.Arbitrary<string> = fc.stringMatching(/^[A-Z0-9]{8}$/);

const emailArb: fc.Arbitrary<string> = fc
  .tuple(
    fc.stringMatching(/^[a-z]{3,10}$/),
    fc.constantFrom('example.com', 'test.org', 'mail.io'),
  )
  .map(([name, domain]) => `${name}@${domain}`);

const passwordArb: fc.Arbitrary<string> = fc.string({ minLength: 8, maxLength: 64 });

// --- Property Tests ---

/**
 * **Validates: Requirements 2.5, 2.6**
 */
describe('Property 23: AAL enforcement on protected routes', () => {
  it('any session at aal1 when aal2 required gets redirected to MFA challenge', () => {
    fc.assert(
      fc.property(sessionArb, (session) => {
        // Force a scenario where the session is at aal1 and aal2 is required
        const aal1Session: Session = {
          ...session,
          currentLevel: 'aal1',
          nextLevel: 'aal2',
        };

        const result = checkRouteAccess({
          session: aal1Session,
          routeRequiresAuth: true,
          routeRequiresAal2: true,
        });

        expect(result.action).toBe('redirect');
        if (result.action === 'redirect') {
          expect(result.target).toBe('mfa-challenge');
        }
      }),
      { numRuns: 100 },
    );
  });

  it('sessions at aal2 are allowed through protected routes', () => {
    fc.assert(
      fc.property(sessionArb, (session) => {
        const aal2Session: Session = {
          ...session,
          currentLevel: 'aal2',
          nextLevel: 'aal2',
        };

        const result = checkRouteAccess({
          session: aal2Session,
          routeRequiresAuth: true,
          routeRequiresAal2: true,
        });

        expect(result.action).toBe('allow');
      }),
      { numRuns: 100 },
    );
  });

  it('sessions at aal1 with no MFA enrolled (nextLevel null) are allowed through', () => {
    fc.assert(
      fc.property(sessionArb, (session) => {
        const noMfaSession: Session = {
          ...session,
          currentLevel: 'aal1',
          nextLevel: null,
        };

        const result = checkRouteAccess({
          session: noMfaSession,
          routeRequiresAuth: true,
          routeRequiresAal2: true,
        });

        // If nextLevel is not 'aal2', user hasn't enrolled MFA, so we allow
        expect(result.action).toBe('allow');
      }),
      { numRuns: 100 },
    );
  });

  it('no session on a protected route redirects to login', () => {
    fc.assert(
      fc.property(fc.boolean(), (requiresAal2) => {
        const result = checkRouteAccess({
          session: null,
          routeRequiresAuth: true,
          routeRequiresAal2: requiresAal2,
        });

        expect(result.action).toBe('redirect');
        if (result.action === 'redirect') {
          expect(result.target).toBe('login');
        }
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * **Validates: Requirements 2.4**
 */
describe('Property 24: Recovery code single-use invalidation', () => {
  it('used codes cannot be reused — second attempt is always rejected', () => {
    fc.assert(
      fc.property(
        fc.array(recoveryCodeArb, { minLength: 1, maxLength: 10 }),
        fc.nat(),
        (codes, indexSeed) => {
          // Pick a unique set of codes
          const uniqueCodes = [...new Set(codes)];
          if (uniqueCodes.length === 0) return;

          const codeIndex = indexSeed % uniqueCodes.length;
          const targetCode = uniqueCodes[codeIndex];

          const store = createRecoveryCodes(uniqueCodes);

          // First use: should succeed
          const firstUse = useRecoveryCode(store, targetCode);
          expect(firstUse.granted).toBe(true);

          // Second use: should be rejected
          const secondUse = useRecoveryCode(firstUse.store, targetCode);
          expect(secondUse.granted).toBe(false);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('unused codes remain valid while other codes are consumed', () => {
    fc.assert(
      fc.property(
        fc.array(recoveryCodeArb, { minLength: 2, maxLength: 10 }),
        (codes) => {
          const uniqueCodes = [...new Set(codes)];
          if (uniqueCodes.length < 2) return;

          let store = createRecoveryCodes(uniqueCodes);

          // Use the first code
          const result = useRecoveryCode(store, uniqueCodes[0]);
          expect(result.granted).toBe(true);
          store = result.store;

          // The second code should still work
          const result2 = useRecoveryCode(store, uniqueCodes[1]);
          expect(result2.granted).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('invalid codes (not in the set) are always rejected', () => {
    fc.assert(
      fc.property(
        fc.array(recoveryCodeArb, { minLength: 1, maxLength: 5 }),
        fc.stringMatching(/^[a-z]{8}$/), // lowercase, won't match uppercase codes
        (codes, invalidCode) => {
          const uniqueCodes = [...new Set(codes)];
          const store = createRecoveryCodes(uniqueCodes);

          // Invalid code that isn't in the store
          if (store.codes.has(invalidCode)) return; // skip if accidentally matches

          const result = useRecoveryCode(store, invalidCode);
          expect(result.granted).toBe(false);
        },
      ),
      { numRuns: 100 },
    );
  });
});

/**
 * **Validates: Requirements 18.8**
 */
describe('Property 31: Unauthenticated API rejection', () => {
  it('no valid session token results in 401 for any endpoint', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          '/api/feed',
          '/api/follow/user-123',
          '/api/walk/walk-456/like',
          '/api/walk/walk-456/comment',
          '/api/discover',
          '/api/walk/walk-789/visibility',
          '/api/profile/johndoe',
        ),
        (endpoint) => {
          const result = checkApiAuth({ sessionToken: null, endpoint });

          expect(result.status).toBe(401);
          expect(result.error).toBe('AUTH_REQUIRED');
          expect(result.data).toBeUndefined();
        },
      ),
      { numRuns: 100 },
    );
  });

  it('valid session token allows request to proceed', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }),
        fc.constantFrom('/api/feed', '/api/discover', '/api/profile/test'),
        (token, endpoint) => {
          const result = checkApiAuth({ sessionToken: token, endpoint });

          expect(result.status).toBe(200);
          expect(result.error).toBeUndefined();
        },
      ),
      { numRuns: 100 },
    );
  });

  it('null session never causes data mutation or retrieval', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          '/api/follow/user-1',
          '/api/walk/w1/like',
          '/api/walk/w1/comment',
        ),
        (endpoint) => {
          const result = checkApiAuth({ sessionToken: null, endpoint });

          // No data should be returned on 401
          expect(result.status).toBe(401);
          expect(result.data).toBeUndefined();
        },
      ),
      { numRuns: 100 },
    );
  });
});

/**
 * **Validates: Requirements 1.3**
 */
describe('Property 33: Login error message opacity', () => {
  it('same error message regardless of whether the email exists', () => {
    fc.assert(
      fc.property(emailArb, emailArb, passwordArb, (existingEmail, attemptEmail, wrongPassword) => {
        const db: UserDatabase = {
          existingEmails: new Set([existingEmail]),
          correctPasswords: new Map([[existingEmail, 'correct-password-xyz']]),
        };

        // Attempt with non-existing email
        const nonExistentResult = attemptLogin(db, {
          email: `nonexistent_${attemptEmail}`,
          password: wrongPassword,
        });

        // Attempt with existing email but wrong password
        const wrongPasswordResult = attemptLogin(db, {
          email: existingEmail,
          password: wrongPassword === 'correct-password-xyz' ? 'other-wrong' : wrongPassword,
        });

        // Both must fail with the SAME error message
        expect(nonExistentResult.success).toBe(false);
        expect(wrongPasswordResult.success).toBe(false);
        expect(nonExistentResult.error).toBe(wrongPasswordResult.error);
      }),
      { numRuns: 100 },
    );
  });

  it('error message does not reveal email existence', () => {
    fc.assert(
      fc.property(emailArb, passwordArb, (email, password) => {
        const db: UserDatabase = {
          existingEmails: new Set([email]),
          correctPasswords: new Map([[email, 'the-real-password']]),
        };

        const result = attemptLogin(db, { email, password: password + '-wrong' });

        // Error message should not contain the email or any hint about existence
        expect(result.error).not.toContain(email);
        expect(result.error).not.toContain('not found');
        expect(result.error).not.toContain('does not exist');
        expect(result.error).not.toContain('already registered');
      }),
      { numRuns: 100 },
    );
  });

  it('successful login only happens with correct credentials', () => {
    fc.assert(
      fc.property(emailArb, passwordArb, (email, correctPassword) => {
        const db: UserDatabase = {
          existingEmails: new Set([email]),
          correctPasswords: new Map([[email, correctPassword]]),
        };

        const result = attemptLogin(db, { email, password: correctPassword });
        expect(result.success).toBe(true);
        expect(result.error).toBeNull();
      }),
      { numRuns: 100 },
    );
  });
});
