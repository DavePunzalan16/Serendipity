'use client';

import { MfaChallengeForm } from '@/components/auth';

export default function MfaChallengePage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-display text-4xl tracking-tight text-white">
          Verify Identity
        </h1>
        <p className="mt-2 font-body text-sm text-offwhite/70">
          Enter the 6-digit code from your authenticator app to continue.
        </p>
      </div>

      {/* MFA Challenge Form */}
      <MfaChallengeForm />
    </div>
  );
}
