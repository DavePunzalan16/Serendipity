'use client';

import Image from 'next/image';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function MfaChallengePage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [useRecovery, setUseRecovery] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError(
        useRecovery
          ? 'Recovery code is required.'
          : 'Verification code is required.'
      );
      return;
    }

    if (!useRecovery && (code.length !== 6 || !/^\d{6}$/.test(code))) {
      setError('Enter a valid 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      // Create the challenge
      const challengeRes = await fetch('/api/auth/mfa/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: useRecovery ? 'recovery' : 'totp' }),
      });

      const challengeData = await challengeRes.json();

      if (!challengeRes.ok) {
        setError(challengeData.error || 'Failed to create MFA challenge.');
        return;
      }

      // Verify the code
      const verifyRes = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          factorId: challengeData.factorId,
          challengeId: challengeData.challengeId,
          code,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setError(verifyData.error || 'Invalid code. Please try again.');
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
        <h1 className="font-display text-4xl text-white">Verify Identity</h1>
        <p className="mt-2 text-offwhite text-sm font-body text-center">
          {useRecovery
            ? 'Enter one of your recovery codes to continue.'
            : 'Enter the 6-digit code from your authenticator app.'}
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

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label
            htmlFor="mfa-code"
            className="block text-sm font-medium text-offwhite mb-1.5 font-body"
          >
            {useRecovery ? 'Recovery Code' : 'Verification Code'}
          </label>
          {useRecovery ? (
            <input
              id="mfa-code"
              type="text"
              autoComplete="off"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded bg-surface px-4 py-3 text-white font-body text-sm text-center tracking-wider placeholder:text-dark-gray placeholder:tracking-normal border border-dark-gray/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              placeholder="xxxx-xxxx-xxxx"
            />
          ) : (
            <input
              id="mfa-code"
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
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary py-3 text-sm font-bold uppercase text-black font-body hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Verifying…' : 'Verify'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => {
            setUseRecovery(!useRecovery);
            setCode('');
            setError('');
          }}
          className="text-sm text-primary font-body hover:text-primary/80 focus:outline-none focus:underline transition"
        >
          {useRecovery
            ? 'Use authenticator code instead'
            : 'Use a recovery code'}
        </button>
      </div>
    </div>
  );
}
