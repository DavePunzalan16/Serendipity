'use client';

import { useState, type FormEvent } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

/**
 * SignupForm — Email/password/confirm registration form component.
 */
export interface SignupFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  error?: string;
}

export default function SignupForm({ onSubmit, error }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(email, password);
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        autoComplete="email"
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
        autoComplete="new-password"
      />
      <Input
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="••••••••"
        required
        autoComplete="new-password"
      />

      {displayError && (
        <p className="font-body text-sm text-red-400" role="alert">
          {displayError}
        </p>
      )}

      <Button type="submit" loading={loading} className="mt-2 w-full">
        Create Account
      </Button>
    </form>
  );
}
