'use client';

import Image from 'next/image';
import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MfaEnrollPage() {
  const router = useRouter();
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(true);
  const [factorId, setFactorId] = useState('');

  useEffect(() => {
    async function enroll() {
      try {
        const res = await fetch('/api/auth/mfa/enroll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to start MFA enrollment.');
          return;
        }

        setQrCode(data.qrCode);
        setSecret(data.secret);
        setFactorId(data.factorId);
      } catch {
        setError('Something went wrong. Please try again.');
      } finally {
        setEnrolling(false);
      }
    }

    enroll();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Verification code is required.');
      return;
    }
    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      setError('Enter a valid 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      // First, create a challenge
      const challengeRes = await fetch('/api/auth/mfa/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ factorId }),
      });

      const challengeData = await challengeRes.json();

      if (!challengeRes.ok) {
        setError(challengeData.error || 'Failed to create MFA challenge.');
        return;
      }

      // Then verify the code
      const verifyRes = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          factorId,
          challengeId: challengeData.challengeId,
          code,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setError(verifyData.error || 'Invalid verification code.');
        return;
      }

      router.push('/');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col items-center mb-8">
        <Image
          src="/img/WandererIcon.png"
          alt="Wander logo"
          width={64}
          height={64}
          className="rounded-full mb-4"
          priority
        />
        <h1 className="font-display text-4xl text-white">Enable MFA</h1>
        <p className="mt-2 text-offwhite text-sm font-body text-center">
          Set up two-factor authentication for extra security.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-md bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      {enrolling ? (
        <div className="flex flex-col items-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-offwhite font-body">
            Setting up authenticator…
          </p>
        </div>
      ) : (
        <>
          {qrCode && (
            <div className="mb-6">
              <p className="text-sm text-offwhite font-body mb-4 text-center">
                Scan this QR code with your authenticator app (Google
                Authenticator, Authy, etc.)
              </p>
              <div className="flex justify-center rounded-lg bg-white p-4">
                {/* QR code is returned as a data URI from the API */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCode}
                  alt="MFA QR code for authenticator app"
                  width={200}
                  height={200}
                />
              </div>
              {secret && (
                <div className="mt-4">
                  <p className="text-xs text-offwhite/70 font-body text-center mb-1">
                    Can&apos;t scan? Enter this key manually:
                  </p>
                  <p className="text-center font-mono text-sm text-primary bg-surface rounded px-3 py-2 select-all break-all">
                    {secret}
                  </p>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="totp-code"
                className="block text-sm font-medium text-offwhite mb-1.5 font-body"
              >
                Verification Code
              </label>
              <input
                id="totp-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                required
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                className="w-full rounded bg-surface px-4 py-3 text-white font-body text-sm text-center tracking-[0.5em] placeholder:text-dark-gray placeholder:tracking-normal border border-dark-gray/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                placeholder="000000"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary py-3 text-sm font-bold uppercase text-black font-body hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Verifying…' : 'Verify & Enable'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
