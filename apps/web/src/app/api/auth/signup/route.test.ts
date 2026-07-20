import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

// Mock the server-side Supabase client
const mockSignUp = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      signUp: (...args: unknown[]) => mockSignUp(...args),
    },
  }),
}));

function createRequest(body: object): Request {
  return new Request("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when email is missing", async () => {
    const response = await POST(createRequest({ password: "test123" }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Email and password are required");
  });

  it("returns 400 when password is missing", async () => {
    const response = await POST(createRequest({ email: "test@example.com" }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Email and password are required");
  });

  it("returns 201 with user and session on successful signup", async () => {
    mockSignUp.mockResolvedValue({
      data: {
        user: { id: "new-user-123", email: "new@example.com" },
        session: {
          access_token: "new-access-token",
          refresh_token: "new-refresh-token",
          expires_at: 1234567890,
        },
      },
      error: null,
    });

    const response = await POST(
      createRequest({ email: "new@example.com", password: "securepass123" })
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.user).toEqual({ id: "new-user-123", email: "new@example.com" });
    expect(body.session).toEqual({
      access_token: "new-access-token",
      refresh_token: "new-refresh-token",
      expires_at: 1234567890,
    });
  });

  it("returns generic error when signup fails (error opacity)", async () => {
    mockSignUp.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "User already registered" },
    });

    const response = await POST(
      createRequest({ email: "existing@example.com", password: "pass123" })
    );
    const body = await response.json();

    // Req 1.3: Never reveal that the email already exists
    expect(response.status).toBe(400);
    expect(body.error).toBe(
      "Unable to create account. Please check your details and try again."
    );
    expect(body.error).not.toContain("already registered");
  });

  it("never reveals whether the email already exists", async () => {
    const errorMessages = [
      "User already registered",
      "Email already in use",
      "Duplicate key value violates unique constraint",
    ];

    for (const message of errorMessages) {
      mockSignUp.mockResolvedValue({
        data: { user: null, session: null },
        error: { message },
      });

      const response = await POST(
        createRequest({ email: "test@example.com", password: "pass123" })
      );
      const body = await response.json();

      expect(body.error).not.toContain("already");
      expect(body.error).not.toContain("registered");
      expect(body.error).not.toContain("duplicate");
      expect(body.error).not.toContain("unique");
    }
  });

  it("returns user without session when email confirmation is required", async () => {
    mockSignUp.mockResolvedValue({
      data: {
        user: { id: "new-user-456", email: "confirm@example.com" },
        session: null,
      },
      error: null,
    });

    const response = await POST(
      createRequest({ email: "confirm@example.com", password: "pass123" })
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.user).toEqual({ id: "new-user-456", email: "confirm@example.com" });
    expect(body.session).toBeNull();
  });
});
