import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";

// Mock the server-side Supabase client
const mockSignInWithPassword = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      signInWithPassword: (...args: unknown[]) => mockSignInWithPassword(...args),
    },
  }),
}));

function createRequest(body: object): Request {
  return new Request("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/login", () => {
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

  it("returns user and session on successful login", async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: {
        user: { id: "user-123", email: "test@example.com" },
        session: {
          access_token: "access-token",
          refresh_token: "refresh-token",
          expires_at: 1234567890,
        },
      },
      error: null,
    });

    const response = await POST(
      createRequest({ email: "test@example.com", password: "correctpass" })
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.user).toEqual({ id: "user-123", email: "test@example.com" });
    expect(body.session).toEqual({
      access_token: "access-token",
      refresh_token: "refresh-token",
      expires_at: 1234567890,
    });
  });

  it("returns generic error for invalid credentials (error opacity)", async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "Invalid login credentials" },
    });

    const response = await POST(
      createRequest({ email: "test@example.com", password: "wrongpass" })
    );
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error).toBe("Invalid email or password");
  });

  it("returns same generic error for non-existent email (error opacity)", async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "User not found" },
    });

    const response = await POST(
      createRequest({ email: "nonexistent@example.com", password: "anypass" })
    );
    const body = await response.json();

    // Req 1.3: Same error message regardless of whether email exists
    expect(response.status).toBe(401);
    expect(body.error).toBe("Invalid email or password");
  });

  it("never reveals whether the email exists in error responses", async () => {
    // Test with different Supabase error messages to ensure they all map to the same response
    const errorMessages = [
      "Invalid login credentials",
      "Email not confirmed",
      "User not found",
      "Signup requires a valid password",
    ];

    for (const message of errorMessages) {
      mockSignInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message },
      });

      const response = await POST(
        createRequest({ email: "test@example.com", password: "pass" })
      );
      const body = await response.json();

      expect(body.error).toBe("Invalid email or password");
      expect(body.error).not.toContain("not found");
      expect(body.error).not.toContain("not confirmed");
    }
  });
});
