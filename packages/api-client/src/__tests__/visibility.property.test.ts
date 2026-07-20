import * as fc from 'fast-check';
import { describe, it, expect } from 'vitest';

// --- Pure visibility access control function ---
// Extracted from the RLS policy logic defined in the design document.
// This mirrors the walks_select RLS policy:
//   user_id = auth.uid()
//   OR visibility = 'public'
//   OR (visibility = 'friends_only' AND EXISTS follow from viewer to owner)

type VisibilitySetting = 'public' | 'friends_only' | 'private';

interface AccessCheckParams {
  walkVisibility: VisibilitySetting;
  viewerIsOwner: boolean;
  viewerFollowsOwner: boolean;
}

/**
 * Determines whether a viewer can access a walk based on visibility rules.
 * This is the pure logic equivalent of the RLS policy on the walks table.
 */
function canAccessWalk(params: AccessCheckParams): boolean {
  if (params.viewerIsOwner) return true;
  if (params.walkVisibility === 'public') return true;
  if (params.walkVisibility === 'friends_only' && params.viewerFollowsOwner) return true;
  return false;
}

/**
 * Simulates the API response for an unauthorized walk access attempt.
 * Returns a 404-like response that does not leak walk existence or visibility.
 */
function getWalkResponse(params: AccessCheckParams & { walkExists: boolean }): {
  status: number;
  body: { error?: string; walk?: object };
} {
  if (!params.walkExists) {
    return { status: 404, body: { error: 'Not found' } };
  }

  if (canAccessWalk(params)) {
    return {
      status: 200,
      body: { walk: { id: 'walk-123', visibility: params.walkVisibility } },
    };
  }

  // Unauthorized: return opaque 404 identical to non-existent walk
  return { status: 404, body: { error: 'Not found' } };
}

interface WalkCreationParams {
  explicitVisibility?: VisibilitySetting;
}

/**
 * Simulates walk creation, returning the effective visibility setting.
 * Defaults to 'friends_only' if no explicit visibility is provided.
 */
function createWalk(params: WalkCreationParams): { visibility: VisibilitySetting } {
  return {
    visibility: params.explicitVisibility ?? 'friends_only',
  };
}

// --- Arbitraries ---

const visibilityArb: fc.Arbitrary<VisibilitySetting> = fc.constantFrom(
  'public',
  'friends_only',
  'private',
);

const accessCheckArb: fc.Arbitrary<AccessCheckParams> = fc.record({
  walkVisibility: visibilityArb,
  viewerIsOwner: fc.boolean(),
  viewerFollowsOwner: fc.boolean(),
});

// --- Property Tests ---

/**
 * **Validates: Requirements 3.3, 3.4, 3.5, 16.3**
 */
describe('Property 1: Walk visibility access control', () => {
  it('grants access iff (a) viewer is owner OR (b) public OR (c) friends_only AND viewer follows owner', () => {
    fc.assert(
      fc.property(accessCheckArb, (params) => {
        const result = canAccessWalk(params);

        // Compute expected access per the specification
        const expected =
          params.viewerIsOwner ||
          params.walkVisibility === 'public' ||
          (params.walkVisibility === 'friends_only' && params.viewerFollowsOwner);

        expect(result).toBe(expected);
      }),
      { numRuns: 100 },
    );
  });

  it('denies access for private walks when viewer is not the owner', () => {
    fc.assert(
      fc.property(fc.boolean(), (viewerFollowsOwner) => {
        const result = canAccessWalk({
          walkVisibility: 'private',
          viewerIsOwner: false,
          viewerFollowsOwner,
        });

        expect(result).toBe(false);
      }),
      { numRuns: 100 },
    );
  });

  it('denies access for friends_only walks when viewer does not follow owner and is not owner', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const result = canAccessWalk({
          walkVisibility: 'friends_only',
          viewerIsOwner: false,
          viewerFollowsOwner: false,
        });

        expect(result).toBe(false);
      }),
      { numRuns: 100 },
    );
  });

  it('always grants access when viewer is the owner regardless of visibility', () => {
    fc.assert(
      fc.property(visibilityArb, fc.boolean(), (visibility, followsOwner) => {
        const result = canAccessWalk({
          walkVisibility: visibility,
          viewerIsOwner: true,
          viewerFollowsOwner: followsOwner,
        });

        expect(result).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * **Validates: Requirements 3.7**
 */
describe('Property 2: Unauthorized access returns opaque 404', () => {
  it('returns identical 404 response for unauthorized access and non-existent walks', () => {
    fc.assert(
      fc.property(accessCheckArb, (params) => {
        if (canAccessWalk(params)) return; // skip authorized cases

        // Response for existing but unauthorized walk
        const unauthorizedResponse = getWalkResponse({ ...params, walkExists: true });

        // Response for truly non-existent walk
        const nonExistentResponse = getWalkResponse({ ...params, walkExists: false });

        // Both must be indistinguishable
        expect(unauthorizedResponse.status).toBe(404);
        expect(nonExistentResponse.status).toBe(404);
        expect(unauthorizedResponse.body).toEqual(nonExistentResponse.body);

        // Must NOT leak visibility info or walk existence
        expect(unauthorizedResponse.body).not.toHaveProperty('walk');
        expect(unauthorizedResponse.body.error).toBe('Not found');
      }),
      { numRuns: 100 },
    );
  });

  it('never reveals visibility setting in 404 response', () => {
    fc.assert(
      fc.property(visibilityArb, fc.boolean(), (visibility, followsOwner) => {
        const params: AccessCheckParams = {
          walkVisibility: visibility,
          viewerIsOwner: false,
          viewerFollowsOwner: followsOwner,
        };

        if (canAccessWalk(params)) return; // skip authorized

        const response = getWalkResponse({ ...params, walkExists: true });

        // Response body stringified must not contain the visibility setting
        const bodyStr = JSON.stringify(response.body);
        expect(bodyStr).not.toContain(visibility);
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * **Validates: Requirements 3.1**
 */
describe('Property 3: New walks default to friends_only visibility', () => {
  it('defaults to friends_only when no explicit visibility is provided', () => {
    fc.assert(
      fc.property(fc.constant(undefined), () => {
        const walk = createWalk({});
        expect(walk.visibility).toBe('friends_only');
      }),
      { numRuns: 100 },
    );
  });

  it('respects explicit visibility when provided at creation time', () => {
    fc.assert(
      fc.property(visibilityArb, (explicitVisibility) => {
        const walk = createWalk({ explicitVisibility });
        expect(walk.visibility).toBe(explicitVisibility);
      }),
      { numRuns: 100 },
    );
  });

  it('friends_only default means walk is not public by default', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const walk = createWalk({});
        // A non-following, non-owner viewer should NOT have access by default
        const accessGranted = canAccessWalk({
          walkVisibility: walk.visibility,
          viewerIsOwner: false,
          viewerFollowsOwner: false,
        });
        expect(accessGranted).toBe(false);
      }),
      { numRuns: 100 },
    );
  });
});
