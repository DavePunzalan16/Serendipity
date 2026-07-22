'use client';

import Button from '../ui/Button';
import Card from '../ui/Card';

/**
 * SecuritySettings — MFA management section for account security.
 */
export interface SecuritySettingsProps {
  mfaEnabled: boolean;
  onEnableMfa: () => void;
  onDisableMfa: () => void;
  onChangePassword: () => void;
  className?: string;
}

export default function SecuritySettings({
  mfaEnabled,
  onEnableMfa,
  onDisableMfa,
  onChangePassword,
  className = '',
}: SecuritySettingsProps) {
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <h2 className="font-body text-lg font-semibold text-white">Security</h2>

      {/* Password */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-body text-sm font-semibold text-white">Password</h3>
            <p className="mt-0.5 font-body text-xs text-offwhite/60">
              Update your password regularly for security
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={onChangePassword}>
            Change
          </Button>
        </div>
      </Card>

      {/* MFA */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-body text-sm font-semibold text-white">
              Two-Factor Authentication
            </h3>
            <p className="mt-0.5 font-body text-xs text-offwhite/60">
              {mfaEnabled
                ? 'Your account is protected with 2FA'
                : 'Add an extra layer of security to your account'}
            </p>
          </div>
          {mfaEnabled ? (
            <Button variant="danger" size="sm" onClick={onDisableMfa}>
              Disable
            </Button>
          ) : (
            <Button size="sm" onClick={onEnableMfa}>
              Enable
            </Button>
          )}
        </div>
        {mfaEnabled && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2">
            <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="font-body text-xs text-green-400">2FA is active</span>
          </div>
        )}
      </Card>
    </div>
  );
}
