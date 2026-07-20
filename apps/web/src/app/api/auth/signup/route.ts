import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/auth/signup
 *
 * Creates a new user account with email and password via Supabase Auth.
 * Returns a generic error message for any failure to avoid revealing
 * whether an email already exists (Requirement 1.3: error message opacity).
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      // Return a generic error to maintain error opacity (Req 1.3).
      // Never reveal whether the email is already registered.
      return NextResponse.json(
        { error: "Unable to create account. Please check your details and try again." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        user: data.user
          ? { id: data.user.id, email: data.user.email }
          : null,
        session: data.session
          ? {
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
              expires_at: data.session.expires_at,
            }
          : null,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
