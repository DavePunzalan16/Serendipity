'use client';

import { useState, type FormEvent } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

/**
 * LoginForm — Email/password login form component.
 * Extracted from the login page for reusability.
 */
export interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  error?: string;
}

export default function LoginForm({ onSubmit, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(email, password);
    } finally {
      setLoading(false);
    }
  };

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
        autoComplete="current-password"
      />

      {error && (
        <p className="font-body text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" loading={loading} className="mt-2 w-full">
        Sign In
      </Button>
    </form>
  );
}
