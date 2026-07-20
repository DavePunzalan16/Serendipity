import { useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useRouter } from "expo-router";
import { getSupabaseClient } from "../supabase";

/**
 * Navigation guard hook that enforces AAL2 on mobile.
 *
 * Checks the user's Authenticator Assurance Level whenever the app
 * returns to the foreground. If MFA is enrolled (nextLevel === 'aal2')
 * but the session hasn't been verified (currentLevel === 'aal1'),
 * navigates to the MFA challenge screen.
 *
 * Use this hook in the root layout or a protected layout wrapping
 * authenticated screens.
 *
 * Requirements: 2.5, 2.6
 */
export function useAALGuard(): void {
  const router = useRouter();
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    // Check AAL on initial mount
    checkAAL();

    // Re-check AAL whenever the app comes back to the foreground.
    // This handles scenarios where the session might have been
    // refreshed without completing the MFA challenge.
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          checkAAL();
        }
        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  async function checkAAL(): Promise<void> {
    try {
      const supabase = getSupabaseClient();

      // First check if there's an authenticated user at all
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // No user session — not our concern here (handled by auth flow)
        return;
      }

      const { data: aalData, error } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (error || !aalData) {
        return;
      }

      // User has MFA enrolled (nextLevel is aal2) but current session
      // is only aal1 — redirect to challenge screen
      if (aalData.currentLevel === "aal1" && aalData.nextLevel === "aal2") {
        router.replace("/(auth)/mfa-challenge");
      }
    } catch {
      // Silently handle errors — don't block the user if the check fails.
      // The server-side RLS policies still enforce aal2 on protected data.
    }
  }
}
