/** Wraps children and redirects to auth screens if no valid session exists. */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getSupabaseClient } from '../../../lib/supabase';
import LoadingScreen from './LoadingScreen';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps): JSX.Element {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace('/(auth)/login');
        return;
      }

      // Check MFA: if user has enrolled factors but session is aal1, redirect to challenge
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const hasEnrolledTotp = factors?.totp && factors.totp.length > 0;

      if (hasEnrolledTotp) {
        const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aal?.currentLevel === 'aal1') {
          router.replace('/(auth)/mfa-challenge');
          return;
        }
      }

      setChecking(false);
    };

    checkSession();
  }, [router]);

  if (checking) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
