'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import Button from '../ui/Button';
import Input from '../ui/Input';

/**
 * MfaEnrollForm — QR code display + TOTP verification code input for MFA enrollment.
 */
export interface MfaEnrollFormProps {
  qrCodeUrl: string;
  secret: string;
  onVerify: (code: string) => Promise<void>;
  error?: string;
}

export default function MfaEnrollForm({ qrCodeUrl, secret, onVerify, error }: MfaEnrollFormProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onVerify(code);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* QR Code */}
      <div className="rounded-lg bg-white p-4">
        <Image
          src={qrCodeUrl}
          alt="Scan this QR code with your authenticator app"
          width={200}
          height={200}
          className="h-[200px] w-[200px]"
        />
      </div>

      {/* Manual entry secret */}
      <div className="text-center">
        <p className="mb-1 font-body text-xs text-offwhite/60">
          Or enter this code manually:
        </p>
        <code className="rounded bg-surface px-3 py-1.5 font-mono text-sm text-primary">
          {secret}
        </code>
      </div>

      {/* Verification */}
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
        <Input
          label="Verification Code"
          type="text"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          placeholder="000000"
          required
          autoComplete="one-time-code"
          error={error}
        />
        <Button type="submit" loading={loading} className="w-full">
          Verify &amp; Enable
        </Button>
      </form>
    </div>
  );
}
