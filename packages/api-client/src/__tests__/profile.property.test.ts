import * as fc from 'fast-check';
import { describe, it, expect } from 'vitest';

// --- Pure profile operation functions ---
// Extracted from the design document's profile management rules.

// --- Types ---

type ValidImageMimeType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
type InvalidMimeType = 'application/pdf' | 'text/plain' | 'image/svg+xml' | 'video/mp4' | 'image/bmp' | 'application/octet-stream';
type MimeType = ValidImageMimeType | InvalidMimeType;

interface ProfileFields {
  display_name?: string;
  bio?: string;
  favorite_vibes?: string[];
}

interface Profile {
  user_id: string;
  display_name: string;
  bio: string;
  favorite_vibes: string[];
}

interface AvatarFile {
  mimeType: MimeType;
  sizeBytes: number;
}

interface WriteOperationRequest {
  requestingUserId: string;
  resourceOwnerId: string;
}

interface UserSearchResult {
  username: string;
  display_name: string;
}

// --- Constants ---

const VALID_IMAGE_TYPES: ValidImageMimeType[] = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

// --- Pure logic functions ---

/**
 * Simulates updating a profile and reading it back.
 * Returns the profile state after the update is applied.
 */
function applyProfileUpdate(currentProfile: Profile, updates: ProfileFields): Profile {
  return {
    ...currentProfile,
    display_name: updates.display_name ?? currentProfile.display_name,
    bio: updates.bio ?? currentProfile.bio,
    favorite_vibes: updates.favorite_vibes ?? currentProfile.favorite_vibes,
  };
}

/**
 * Validates whether a file is acceptable as an avatar upload.
 * Returns { valid: true } if acceptable, { valid: false, reason: string } otherwise.
 */
function validateAvatarUpload(file: AvatarFile): { valid: boolean; reason?: string } {
  if (!VALID_IMAGE_TYPES.includes(file.mimeType as ValidImageMimeType)) {
    return { valid: false, reason: 'Invalid image type' };
  }
  if (file.sizeBytes > MAX_AVATAR_SIZE_BYTES) {
    return { valid: false, reason: 'File exceeds 5MB limit' };
  }
  return { valid: true };
}

/**
 * Determines whether a write operation should be allowed based on ownership.
 * Only the resource owner may perform write operations on their profile.
 */
function canPerformWriteOperation(request: WriteOperationRequest): boolean {
  return request.requestingUserId === request.resourceOwnerId;
}

/**
 * Simulates profile update with ownership check.
 */
function performProfileUpdate(
  request: WriteOperationRequest,
  currentProfile: Profile,
  updates: ProfileFields,
): { status: number; body: { profile?: Profile; error?: string } } {
  if (!canPerformWriteOperation(request)) {
    return { status: 403, body: { error: 'Forbidden' } };
  }
  const updatedProfile = applyProfileUpdate(currentProfile, updates);
  return { status: 200, body: { profile: updatedProfile } };
}

/**
 * Simulates avatar upload with ownership and validation checks.
 */
function performAvatarUpload(
  request: WriteOperationRequest,
  file: AvatarFile,
): { status: number; body: { avatar_url?: string; error?: string } } {
  if (!canPerformWriteOperation(request)) {
    return { status: 403, body: { error: 'Forbidden' } };
  }
  const validation = validateAvatarUpload(file);
  if (!validation.valid) {
    return { status: 400, body: { error: validation.reason } };
  }
  return { status: 200, body: { avatar_url: `https://storage.example.com/avatars/${request.resourceOwnerId}` } };
}

/**
 * Filters user search results — only returns users whose username or
 * display_name contains the query string (case-insensitive).
 */
function searchUsers(users: UserSearchResult[], query: string): UserSearchResult[] {
  const lowerQuery = query.toLowerCase();
  return users.filter(
    (u) =>
      u.username.toLowerCase().includes(lowerQuery) ||
      u.display_name.toLowerCase().includes(lowerQuery),
  );
}

// --- Arbitraries ---

const userIdArb: fc.Arbitrary<string> = fc.uuid();

const displayNameArb: fc.Arbitrary<string> = fc.string({ minLength: 1, maxLength: 50 });

const bioArb: fc.Arbitrary<string> = fc.string({ minLength: 0, maxLength: 300 });

const vibeArb: fc.Arbitrary<string> = fc.string({ minLength: 1, maxLength: 20 }).map(
  (s) => s.replace(/[^a-z \-]/g, 'a') || 'chill',
);

const favoriteVibesArb: fc.Arbitrary<string[]> = fc.array(vibeArb, { minLength: 0, maxLength: 10 });

const profileFieldsArb: fc.Arbitrary<ProfileFields> = fc.record({
  display_name: fc.option(displayNameArb, { nil: undefined }),
  bio: fc.option(bioArb, { nil: undefined }),
  favorite_vibes: fc.option(favoriteVibesArb, { nil: undefined }),
});

const profileArb: fc.Arbitrary<Profile> = fc.record({
  user_id: userIdArb,
  display_name: displayNameArb,
  bio: bioArb,
  favorite_vibes: favoriteVibesArb,
});

const validMimeTypeArb: fc.Arbitrary<ValidImageMimeType> = fc.constantFrom(
  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
);

const invalidMimeTypeArb: fc.Arbitrary<InvalidMimeType> = fc.constantFrom(
  'application/pdf', 'text/plain', 'image/svg+xml', 'video/mp4', 'image/bmp', 'application/octet-stream',
);

const validFileSizeArb: fc.Arbitrary<number> = fc.integer({ min: 1, max: MAX_AVATAR_SIZE_BYTES });

const oversizedFileSizeArb: fc.Arbitrary<number> = fc.integer({
  min: MAX_AVATAR_SIZE_BYTES + 1,
  max: MAX_AVATAR_SIZE_BYTES * 3,
});

const usernameArb: fc.Arbitrary<string> = fc.string({ minLength: 3, maxLength: 20 }).map(
  (s) => s.replace(/[^a-z0-9_]/g, 'a').slice(0, 20) || 'user',
);

const searchQueryArb: fc.Arbitrary<string> = fc.string({ minLength: 1, maxLength: 10 }).map(
  (s) => s.replace(/[^a-z]/g, 'a').slice(0, 10) || 'a',
);

// --- Property Tests ---

/**
 * **Validates: Property 25 — Profile update round-trip**
 * For any valid profile field update (display_name, bio, favorite_vibes),
 * reading back the profile after update SHALL return the updated values
 * exactly as submitted.
 */
describe('Property 25: Profile update round-trip', () => {
  it('returns updated display_name exactly as submitted', () => {
    fc.assert(
      fc.property(profileArb, displayNameArb, (profile, newName) => {
        const updated = applyProfileUpdate(profile, { display_name: newName });
        expect(updated.display_name).toBe(newName);
      }),
      { numRuns: 100 },
    );
  });

  it('returns updated bio exactly as submitted', () => {
    fc.assert(
      fc.property(profileArb, bioArb, (profile, newBio) => {
        const updated = applyProfileUpdate(profile, { bio: newBio });
        expect(updated.bio).toBe(newBio);
      }),
      { numRuns: 100 },
    );
  });

  it('returns updated favorite_vibes exactly as submitted', () => {
    fc.assert(
      fc.property(profileArb, favoriteVibesArb, (profile, newVibes) => {
        const updated = applyProfileUpdate(profile, { favorite_vibes: newVibes });
        expect(updated.favorite_vibes).toEqual(newVibes);
      }),
      { numRuns: 100 },
    );
  });

  it('preserves unchanged fields when partial update is applied', () => {
    fc.assert(
      fc.property(profileArb, profileFieldsArb, (profile, updates) => {
        const updated = applyProfileUpdate(profile, updates);

        // Fields that were not in the update should remain unchanged
        if (updates.display_name === undefined) {
          expect(updated.display_name).toBe(profile.display_name);
        }
        if (updates.bio === undefined) {
          expect(updated.bio).toBe(profile.bio);
        }
        if (updates.favorite_vibes === undefined) {
          expect(updated.favorite_vibes).toEqual(profile.favorite_vibes);
        }
      }),
      { numRuns: 100 },
    );
  });

  it('applying the same update twice yields the same result (idempotency)', () => {
    fc.assert(
      fc.property(profileArb, profileFieldsArb, (profile, updates) => {
        const firstUpdate = applyProfileUpdate(profile, updates);
        const secondUpdate = applyProfileUpdate(firstUpdate, updates);

        expect(secondUpdate).toEqual(firstUpdate);
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * **Validates: Property 26 — Avatar upload validation**
 * For any file submitted as an avatar, if the file is not a valid image type
 * (JPEG, PNG, WebP, GIF) OR exceeds 5MB in size, the upload SHALL be rejected.
 * For any valid image file ≤5MB, the upload SHALL succeed.
 */
describe('Property 26: Avatar upload validation', () => {
  it('accepts files with valid MIME type and size ≤ 5MB', () => {
    fc.assert(
      fc.property(validMimeTypeArb, validFileSizeArb, (mimeType, sizeBytes) => {
        const result = validateAvatarUpload({ mimeType, sizeBytes });
        expect(result.valid).toBe(true);
      }),
      { numRuns: 100 },
    );
  });

  it('rejects files with invalid MIME type regardless of size', () => {
    fc.assert(
      fc.property(
        invalidMimeTypeArb,
        fc.integer({ min: 1, max: MAX_AVATAR_SIZE_BYTES * 2 }),
        (mimeType, sizeBytes) => {
          const result = validateAvatarUpload({ mimeType, sizeBytes });
          expect(result.valid).toBe(false);
          expect(result.reason).toBe('Invalid image type');
        },
      ),
      { numRuns: 100 },
    );
  });

  it('rejects files exceeding 5MB even with valid MIME type', () => {
    fc.assert(
      fc.property(validMimeTypeArb, oversizedFileSizeArb, (mimeType, sizeBytes) => {
        const result = validateAvatarUpload({ mimeType, sizeBytes });
        expect(result.valid).toBe(false);
        expect(result.reason).toBe('File exceeds 5MB limit');
      }),
      { numRuns: 100 },
    );
  });

  it('rejects files that are both invalid type AND oversized', () => {
    fc.assert(
      fc.property(invalidMimeTypeArb, oversizedFileSizeArb, (mimeType, sizeBytes) => {
        const result = validateAvatarUpload({ mimeType, sizeBytes });
        expect(result.valid).toBe(false);
      }),
      { numRuns: 100 },
    );
  });

  it('boundary: file exactly at 5MB limit is accepted', () => {
    fc.assert(
      fc.property(validMimeTypeArb, (mimeType) => {
        const result = validateAvatarUpload({ mimeType, sizeBytes: MAX_AVATAR_SIZE_BYTES });
        expect(result.valid).toBe(true);
      }),
      { numRuns: 100 },
    );
  });

  it('boundary: file at 5MB + 1 byte is rejected', () => {
    fc.assert(
      fc.property(validMimeTypeArb, (mimeType) => {
        const result = validateAvatarUpload({ mimeType, sizeBytes: MAX_AVATAR_SIZE_BYTES + 1 });
        expect(result.valid).toBe(false);
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * **Validates: Property 27 — Owner-only write operations**
 * For any write operation (profile update, avatar upload), if the requesting
 * user is not the resource owner, the operation SHALL be rejected.
 */
describe('Property 27: Owner-only write operations', () => {
  it('allows profile update when requester is the resource owner', () => {
    fc.assert(
      fc.property(userIdArb, profileArb, profileFieldsArb, (userId, profile, updates) => {
        const result = performProfileUpdate(
          { requestingUserId: userId, resourceOwnerId: userId },
          { ...profile, user_id: userId },
          updates,
        );
        expect(result.status).toBe(200);
        expect(result.body.profile).toBeDefined();
      }),
      { numRuns: 100 },
    );
  });

  it('rejects profile update when requester is NOT the resource owner', () => {
    fc.assert(
      fc.property(
        userIdArb,
        userIdArb.filter((id) => id.length > 0),
        profileArb,
        profileFieldsArb,
        (requesterId, ownerId, profile, updates) => {
          // Ensure different users
          if (requesterId === ownerId) return;

          const result = performProfileUpdate(
            { requestingUserId: requesterId, resourceOwnerId: ownerId },
            { ...profile, user_id: ownerId },
            updates,
          );
          expect(result.status).toBe(403);
          expect(result.body.error).toBe('Forbidden');
          expect(result.body.profile).toBeUndefined();
        },
      ),
      { numRuns: 100 },
    );
  });

  it('allows avatar upload when requester is the resource owner with valid file', () => {
    fc.assert(
      fc.property(userIdArb, validMimeTypeArb, validFileSizeArb, (userId, mimeType, size) => {
        const result = performAvatarUpload(
          { requestingUserId: userId, resourceOwnerId: userId },
          { mimeType, sizeBytes: size },
        );
        expect(result.status).toBe(200);
        expect(result.body.avatar_url).toBeDefined();
      }),
      { numRuns: 100 },
    );
  });

  it('rejects avatar upload when requester is NOT the resource owner', () => {
    fc.assert(
      fc.property(
        userIdArb,
        userIdArb,
        validMimeTypeArb,
        validFileSizeArb,
        (requesterId, ownerId, mimeType, size) => {
          if (requesterId === ownerId) return;

          const result = performAvatarUpload(
            { requestingUserId: requesterId, resourceOwnerId: ownerId },
            { mimeType, sizeBytes: size },
          );
          expect(result.status).toBe(403);
          expect(result.body.error).toBe('Forbidden');
          expect(result.body.avatar_url).toBeUndefined();
        },
      ),
      { numRuns: 100 },
    );
  });

  it('ownership check takes precedence over file validation', () => {
    fc.assert(
      fc.property(
        userIdArb,
        userIdArb,
        invalidMimeTypeArb,
        oversizedFileSizeArb,
        (requesterId, ownerId, mimeType, size) => {
          if (requesterId === ownerId) return;

          // Even with an invalid file, the 403 should come first
          const result = performAvatarUpload(
            { requestingUserId: requesterId, resourceOwnerId: ownerId },
            { mimeType, sizeBytes: size },
          );
          expect(result.status).toBe(403);
          expect(result.body.error).toBe('Forbidden');
        },
      ),
      { numRuns: 100 },
    );
  });
});

/**
 * **Validates: Property 32 — User search relevance**
 * For any search query string, all returned user results SHALL have a username
 * or display_name that contains the query string as a substring (case-insensitive).
 */
describe('Property 32: User search relevance', () => {
  it('all returned results contain the query in username or display_name (case-insensitive)', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({ username: usernameArb, display_name: displayNameArb }), {
          minLength: 0,
          maxLength: 50,
        }),
        searchQueryArb,
        (users, query) => {
          const results = searchUsers(users, query);
          const lowerQuery = query.toLowerCase();

          for (const result of results) {
            const matchesUsername = result.username.toLowerCase().includes(lowerQuery);
            const matchesDisplayName = result.display_name.toLowerCase().includes(lowerQuery);
            expect(matchesUsername || matchesDisplayName).toBe(true);
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  it('never returns users that do not match the query', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({ username: usernameArb, display_name: displayNameArb }), {
          minLength: 1,
          maxLength: 30,
        }),
        searchQueryArb,
        (users, query) => {
          const results = searchUsers(users, query);
          const lowerQuery = query.toLowerCase();

          // Every result must match
          const allMatch = results.every(
            (r) =>
              r.username.toLowerCase().includes(lowerQuery) ||
              r.display_name.toLowerCase().includes(lowerQuery),
          );
          expect(allMatch).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('returns all users that DO match the query (no false negatives)', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({ username: usernameArb, display_name: displayNameArb }), {
          minLength: 0,
          maxLength: 30,
        }),
        searchQueryArb,
        (users, query) => {
          const results = searchUsers(users, query);
          const lowerQuery = query.toLowerCase();

          // Every user that should match must be in the results
          const expectedMatches = users.filter(
            (u) =>
              u.username.toLowerCase().includes(lowerQuery) ||
              u.display_name.toLowerCase().includes(lowerQuery),
          );

          expect(results.length).toBe(expectedMatches.length);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('search is case-insensitive', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({ username: usernameArb, display_name: displayNameArb }), {
          minLength: 0,
          maxLength: 20,
        }),
        searchQueryArb,
        (users, query) => {
          const lowerResults = searchUsers(users, query.toLowerCase());
          const upperResults = searchUsers(users, query.toUpperCase());
          const mixedResults = searchUsers(users, query);

          // All case variants should produce the same results
          expect(lowerResults).toEqual(upperResults);
          expect(lowerResults).toEqual(mixedResults);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('empty results are valid when no users match the query', () => {
    fc.assert(
      fc.property(searchQueryArb, (query) => {
        // Users that deliberately don't contain the query
        const users: UserSearchResult[] = [
          { username: 'zzzzz', display_name: 'ZZZZZ' },
          { username: 'xxxxx', display_name: 'XXXXX' },
        ];

        // Only proceed if query is guaranteed to not match
        const lowerQuery = query.toLowerCase();
        const anyMatch = users.some(
          (u) =>
            u.username.toLowerCase().includes(lowerQuery) ||
            u.display_name.toLowerCase().includes(lowerQuery),
        );

        if (!anyMatch) {
          const results = searchUsers(users, query);
          expect(results).toHaveLength(0);
        }
      }),
      { numRuns: 100 },
    );
  });
});
