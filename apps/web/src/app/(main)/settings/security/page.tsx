'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SecuritySettingsPage() {
  const [mfaEnrolled, setMfaEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [mfaMessage, setMfaMessage] = useState('');

  useEffect(() => {
    checkMfaStatus();
  }, []);

  async function checkMfaStatus() {
    const supabase = createClient();
    const { data } = await supabase.auth.mfa.listFactors();
    const totpFactors = data?.totp ?? [];
    const verified = totpFactors.filter((f) => f.status === 'verified');
    setMfaEnrolled(verified.length > 0);
    setLoading(false);
  }

  async function handleDisableMfa() {
    const supabase = createClient();
    const { data } = await supabase.auth.mfa.listFactors();
    const totpFactors = data?.totp ?? [];
    const verified = totpFactors.filter((f) => f.status === 'verified');

    if (verified.length === 0) return;

    const { error } = await supabase.auth.mfa.unenroll({
      factorId: verified[0].id,
    });

    if (error) {
      setMfaMessage(error.message);
    } else {
      setMfaEnrolled(false);
      setMfaMessage('MFA has been disabled.');
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMessage('');

    if (newPassword !== confirmPassword) {
      setPasswordMessage('Passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage('Password must be at least 8 characters.');
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setPasswordMessage(error.message);
    } else {
      setPasswordMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[var(--color-offwhite)]">Loading security settings...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="font-[var(--font-display)] text-3xl text-white">
        Security Settings
      </h1>

      {/* MFA Section */}
      <section className="rounded-xl bg-[var(--color-surface)] p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">
          Multi-Factor Authentication
        </h2>
        <div className="flex items-center gap-3">
          <span
            className={`inline-block h-3 w-3 rounded-full ${
              mfaEnrolled ? 'bg-green-400' : 'bg-[var(--color-dark-gray)]'
            }`}
          />
          <p className="text-[var(--color-offwhite)]">
            {mfaEnrolled
              ? 'MFA is enabled on your account.'
              : 'MFA is not enabled. We recommend enabling it for additional security.'}
          </p>
        </div>

        {mfaMessage && (
          <p className="text-sm text-[var(--color-primary)]">{mfaMessage}</p>
        )}

        <div className="flex gap-3">
          {!mfaEnrolled && (
            <a
              href="/mfa-enroll"
              className="inline-flex items-center rounded-full bg-[var(--color-primary)] px-6 py-2.5 text-sm font-bold uppercase text-[#0A0A0A] transition-opacity hover:opacity-90"
            >
              Enroll MFA
            </a>
          )}
          {mfaEnrolled && (
            <button
              onClick={handleDisableMfa}
              className="inline-flex items-center rounded-full border border-red-400 px-6 py-2.5 text-sm font-bold uppercase text-red-400 transition-colors hover:bg-red-400/10"
            >
              Disable MFA
            </button>
          )}
        </div>
      </section>

      {/* Change Password Section */}
      <section className="rounded-xl bg-[var(--color-surface)] p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label
              htmlFor="current-password"
              className="mb-1 block text-sm font-medium text-[var(--color-offwhite)]"
            >
              Current Password
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded bg-[var(--color-background)] px-4 py-2.5 text-white placeholder:text-[var(--color-dark-gray)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Enter current password"
              required
            />
          </div>
          <div>
            <label
              htmlFor="new-password"
              className="mb-1 block text-sm font-medium text-[var(--color-offwhite)]"
            >
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded bg-[var(--color-background)] px-4 py-2.5 text-white placeholder:text-[var(--color-dark-gray)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Enter new password"
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="mb-1 block text-sm font-medium text-[var(--color-offwhite)]"
            >
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded bg-[var(--color-background)] px-4 py-2.5 text-white placeholder:text-[var(--color-dark-gray)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Confirm new password"
              required
            />
          </div>

          {passwordMessage && (
            <p
              className={`text-sm ${
                passwordMessage.includes('successfully')
                  ? 'text-green-400'
                  : 'text-red-400'
              }`}
            >
              {passwordMessage}
            </p>
          )}

          <button
            type="submit"
            className="rounded-full bg-[var(--color-primary)] px-6 py-2.5 text-sm font-bold uppercase text-[#0A0A0A] transition-opacity hover:opacity-90"
          >
            Update Password
          </button>
        </form>
      </section>

      {/* Session Management Section */}
      <section className="rounded-xl bg-[var(--color-surface)] p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">Sessions</h2>
        <p className="text-[var(--color-offwhite)]">
          You are currently signed in on this device. Supabase manages your
          active sessions. Signing out will invalidate your current session
          token.
        </p>
        <p className="text-sm text-[var(--color-dark-gray)]">
          Sessions expire automatically after the configured inactivity period.
          Use the sign-out button in the navigation to end your current session.
        </p>
      </section>
    </div>
  );
}
