'use client';

import { MfaEnrollForm } from '@/components/auth';

export default function MfaEnrollPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-display text-4xl tracking-tight text-white">
          Two-Factor Auth
        </h1>
        <p className="mt-2 font-body text-sm text-offwhite/70">
          Add an extra layer of security to your account with an authenticator app.
        </p>
      </div>

      {/* MFA Enrollment Form */}
      <MfaEnrollForm />
    </div>
  );
}
