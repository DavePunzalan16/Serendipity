'use client';

import { useState, useRef, type FormEvent, type KeyboardEvent } from 'react';
import Button from '../ui/Button';

/**
 * MfaChallengeForm — 6-digit TOTP input for MFA challenge verification.
 * Uses individual digit inputs for better UX.
 */
export interface MfaChallengeFormProps {
  onVerify: (code: string) => Promise<void>;
  error?: string;
}

export default function MfaChallengeForm({ onVerify, error }: MfaChallengeFormProps) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newDigits = Array(6).fill('');
    pasted.split('').forEach((char, i) => {
      newDigits[i] = char;
    });
    setDigits(newDigits);
    const nextEmpty = pasted.length < 6 ? pasted.length : 5;
    inputsRef.current[nextEmpty]?.focus();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length !== 6) return;

    setLoading(true);
    try {
      await onVerify(code);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h3 className="mb-2 font-body text-lg font-semibold text-white">
          Two-Factor Authentication
        </h3>
        <p className="font-body text-sm text-offwhite/70">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      {/* Digit inputs */}
      <div className="flex gap-2" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputsRef.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="h-12 w-10 rounded-md border border-dark-gray/50 bg-surface text-center font-mono text-lg text-white transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label={`Digit ${index + 1}`}
          />
        ))}
      </div>

      {error && (
        <p className="font-body text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" loading={loading} disabled={digits.join('').length !== 6}>
        Verify
      </Button>
    </form>
  );
}
