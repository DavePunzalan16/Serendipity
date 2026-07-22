'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm, GoogleOAuthButton } from '@/components/auth';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleLogin = async (email: string, password: string) => {
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid email or password');
        return;
      }
      router.push('/feed');
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-display text-4xl tracking-tight text-white">Welcome back</h1>
        <p className="mt-2 font-body text-sm text-offwhite/70">
          Sign in to continue your wandering journey.
        </p>
      </div>

      {/* Google OAuth */}
      <GoogleOAuthButton />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-dark-gray/50" />
        <span className="font-body text-xs text-offwhite/50">or</span>
        <div className="h-px flex-1 bg-dark-gray/50" />
      </div>

      {/* Login form */}
      <LoginForm onSubmit={handleLogin} error={error} />

      {/* Sign up link */}
      <p className="text-center font-body text-sm text-offwhite/70">
        Don&apos;t have an account?{' '}
        <a href="/signup" className="font-semibold text-primary hover:text-primary/80 transition-colors">
          Sign up
        </a>
      </p>
    </div>
  );
}
