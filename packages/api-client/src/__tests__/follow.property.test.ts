import * as fc from 'fast-check';
import { describe, it, expect } from 'vitest';

// --- Pure follow system logic ---
// Simulates the follow system behavior defined in the design document.
// Models the `follows` table with constraints:
//   PRIMARY KEY (follower_id, following_id)
//   CONSTRAINT no_self_follow CHECK (follower_id != following_id)
// And atomic count updates on profiles.

interface FollowState {
  /** Set of "followerId:followingId" strings representing active follow relationships */
  relationships: Set<string>;
  /** Map from userId to their follower count (people following them) */
  followerCounts: Map<string, number>;
  /** Map from userId to their following count (people they follow) */
  followingCounts: Map<string, number>;
}

type FollowResult =
  | { success: true }
  | { success: false; reason: 'self_follow' | 'duplicate' | 'not_found' };

function createFollowState(): FollowState {
  return {
    relationships: new Set(),
    followerCounts: new Map(),
    followingCounts: new Map(),
  };
}

function getFollowerCount(state: FollowState, userId: string): number {
  return state.followerCounts.get(userId) ?? 0;
}

function getFollowingCount(state: FollowState, userId: string): number {
  return state.followingCounts.get(userId) ?? 0;
}

/**
 * Simulates POST /api/follow/[userId] — creates a follow relationship.
 * Enforces: no self-follow, no duplicate relationships.
 * On success: increments following count for follower, follower count for followed user.
 */
function followUser(state: FollowState, followerId: string, followingId: string): FollowResult {
  // Constraint: no self-follow
  if (followerId === followingId) {
    return { success: false, reason: 'self_follow' };
  }

  const key = `${followerId}:${followingId}`;

  // Constraint: no duplicate follow
  if (state.relationships.has(key)) {
    return { success: false, reason: 'duplicate' };
  }

  // Create relationship
  state.relationships.add(key);

  // Increment counts atomically
  state.followingCounts.set(followerId, getFollowingCount(state, followerId) + 1);
  state.followerCounts.set(followingId, getFollowerCount(state, followingId) + 1);

  return { success: true };
}

/**
 * Simulates DELETE /api/follow/[userId] — removes a follow relationship.
 * On success: decrements following count for follower, follower count for followed user.
 */
function unfollowUser(state: FollowState, followerId: string, followingId: string): FollowResult {
  const key = `${followerId}:${followingId}`;

  if (!state.relationships.has(key)) {
    return { success: false, reason: 'not_found' };
  }

  // Remove relationship
  state.relationships.delete(key);

  // Decrement counts atomically
  state.followingCounts.set(followerId, getFollowingCount(state, followerId) - 1);
  state.followerCounts.set(followingId, getFollowerCount(state, followingId) - 1);

  return { success: true };
}

// --- Arbitraries ---

/** Generates distinct user ID pairs (userA !== userB) */
const distinctUserPairArb: fc.Arbitrary<{ userA: string; userB: string }> = fc
  .tuple(
    fc.uuid(),
    fc.uuid(),
  )
  .filter(([a, b]) => a !== b)
  .map(([a, b]) => ({ userA: a, userB: b }));

/** Generates a single user ID */
const userIdArb: fc.Arbitrary<string> = fc.uuid();

// --- Property Tests ---

/**
 * **Validates: Requirements 5.1, 5.2**
 */
describe('Property 4: Follow/unfollow round-trip preserves counts', () => {
  it('follow then unfollow returns follower and following counts to original values', () => {
    fc.assert(
      fc.property(distinctUserPairArb, ({ userA, userB }) => {
        const state = createFollowState();

        // Record original counts
        const originalFollowingA = getFollowingCount(state, userA);
        const originalFollowerB = getFollowerCount(state, userB);

        // A follows B
        const followResult = followUser(state, userA, userB);
        expect(followResult.success).toBe(true);

        // Counts should have incremented
        expect(getFollowingCount(state, userA)).toBe(originalFollowingA + 1);
        expect(getFollowerCount(state, userB)).toBe(originalFollowerB + 1);

        // A unfollows B
        const unfollowResult = unfollowUser(state, userA, userB);
        expect(unfollowResult.success).toBe(true);

        // Counts should return to original
        expect(getFollowingCount(state, userA)).toBe(originalFollowingA);
        expect(getFollowerCount(state, userB)).toBe(originalFollowerB);
      }),
      { numRuns: 100 },
    );
  });

  it('follow then unfollow round-trip preserves counts even with pre-existing relationships', () => {
    fc.assert(
      fc.property(
        fc.array(distinctUserPairArb, { minLength: 1, maxLength: 10 }),
        distinctUserPairArb,
        (existingPairs, targetPair) => {
          const state = createFollowState();

          // Set up some pre-existing follow relationships
          for (const { userA, userB } of existingPairs) {
            followUser(state, userA, userB);
          }

          const { userA, userB } = targetPair;

          // Ensure target pair isn't already following
          const key = `${userA}:${userB}`;
          if (state.relationships.has(key)) return; // skip if already exists

          // Record counts before round-trip
          const beforeFollowingA = getFollowingCount(state, userA);
          const beforeFollowerB = getFollowerCount(state, userB);

          // Follow then unfollow
          const followResult = followUser(state, userA, userB);
          if (!followResult.success) return; // skip self-follows

          const unfollowResult = unfollowUser(state, userA, userB);
          expect(unfollowResult.success).toBe(true);

          // Counts should return to pre-round-trip values
          expect(getFollowingCount(state, userA)).toBe(beforeFollowingA);
          expect(getFollowerCount(state, userB)).toBe(beforeFollowerB);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('follow increments counts by exactly 1 and unfollow decrements by exactly 1', () => {
    fc.assert(
      fc.property(distinctUserPairArb, ({ userA, userB }) => {
        const state = createFollowState();

        const beforeFollowingA = getFollowingCount(state, userA);
        const beforeFollowerB = getFollowerCount(state, userB);

        // Follow: +1 each
        followUser(state, userA, userB);
        expect(getFollowingCount(state, userA)).toBe(beforeFollowingA + 1);
        expect(getFollowerCount(state, userB)).toBe(beforeFollowerB + 1);

        // Unfollow: -1 each
        unfollowUser(state, userA, userB);
        expect(getFollowingCount(state, userA)).toBe(beforeFollowingA);
        expect(getFollowerCount(state, userB)).toBe(beforeFollowerB);
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * **Validates: Requirements 5.3, 5.4**
 */
describe('Property 5: Follow constraint enforcement', () => {
  it('self-follow is always rejected', () => {
    fc.assert(
      fc.property(userIdArb, (userId) => {
        const state = createFollowState();

        const result = followUser(state, userId, userId);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.reason).toBe('self_follow');
        }

        // Relationship should not exist
        expect(state.relationships.has(`${userId}:${userId}`)).toBe(false);

        // Counts should remain at 0
        expect(getFollowerCount(state, userId)).toBe(0);
        expect(getFollowingCount(state, userId)).toBe(0);
      }),
      { numRuns: 100 },
    );
  });

  it('duplicate follow is rejected without altering relationship or counts', () => {
    fc.assert(
      fc.property(distinctUserPairArb, ({ userA, userB }) => {
        const state = createFollowState();

        // First follow succeeds
        const firstResult = followUser(state, userA, userB);
        expect(firstResult.success).toBe(true);

        // Record counts after first follow
        const followingCountA = getFollowingCount(state, userA);
        const followerCountB = getFollowerCount(state, userB);
        const relationshipCount = state.relationships.size;

        // Duplicate follow is rejected
        const duplicateResult = followUser(state, userA, userB);
        expect(duplicateResult.success).toBe(false);
        if (!duplicateResult.success) {
          expect(duplicateResult.reason).toBe('duplicate');
        }

        // Counts should not have changed
        expect(getFollowingCount(state, userA)).toBe(followingCountA);
        expect(getFollowerCount(state, userB)).toBe(followerCountB);

        // Relationship set size unchanged
        expect(state.relationships.size).toBe(relationshipCount);
      }),
      { numRuns: 100 },
    );
  });

  it('self-follow rejection does not affect other valid relationships', () => {
    fc.assert(
      fc.property(distinctUserPairArb, userIdArb, ({ userA, userB }, selfUser) => {
        const state = createFollowState();

        // Create a valid relationship first
        followUser(state, userA, userB);
        const relCount = state.relationships.size;

        // Attempt self-follow
        followUser(state, selfUser, selfUser);

        // Original relationship still intact, no new relationship added
        expect(state.relationships.has(`${userA}:${userB}`)).toBe(true);
        expect(state.relationships.has(`${selfUser}:${selfUser}`)).toBe(false);
        expect(state.relationships.size).toBe(relCount);
      }),
      { numRuns: 100 },
    );
  });

  it('multiple duplicate follow attempts never increment counts', () => {
    fc.assert(
      fc.property(
        distinctUserPairArb,
        fc.integer({ min: 2, max: 10 }),
        ({ userA, userB }, attempts) => {
          const state = createFollowState();

          // First follow succeeds
          followUser(state, userA, userB);

          const expectedFollowingA = getFollowingCount(state, userA);
          const expectedFollowerB = getFollowerCount(state, userB);

          // Repeated duplicate attempts should all fail and leave counts unchanged
          for (let i = 0; i < attempts; i++) {
            const result = followUser(state, userA, userB);
            expect(result.success).toBe(false);
          }

          expect(getFollowingCount(state, userA)).toBe(expectedFollowingA);
          expect(getFollowerCount(state, userB)).toBe(expectedFollowerB);
        },
      ),
      { numRuns: 100 },
    );
  });
});
