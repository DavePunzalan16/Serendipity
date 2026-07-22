'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignupForm, GoogleOAuthButton } from '@/components/auth';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSignup = async (email: string, password: string) => {
    setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create account');
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
        <h1 className="font-display text-4xl tracking-tight text-white">Create account</h1>
        <p className="mt-2 font-body text-sm text-offwhite/70">
          Start exploring walks and connecting with other wanderers.
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

      {/* Signup form */}
      <SignupForm onSubmit={handleSignup} error={error} />

      {/* Login link */}
      <p className="text-center font-body text-sm text-offwhite/70">
        Already have an account?{' '}
        <a href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
          Sign in
        </a>
      </p>
    </div>
  );
}
