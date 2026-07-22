'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer, Sidebar } from '@/components/layout';
import { SecuritySettings } from '@/components/settings';
import type { SidebarItem } from '@/components/layout';

const SETTINGS_ITEMS: SidebarItem[] = [
  { label: 'Profile', href: '/settings/profile' },
  { label: 'Security', href: '/settings/security' },
  { label: 'Notifications', href: '/settings/notifications' },
  { label: 'Privacy', href: '/settings/privacy' },
  { label: 'Account', href: '/settings/account' },
];

export default function SecuritySettingsPage() {
  const router = useRouter();
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const handleEnableMfa = useCallback(() => {
    router.push('/mfa-enroll');
  }, [router]);

  const handleDisableMfa = useCallback(() => {
    setMfaEnabled(false);
  }, []);

  const handleChangePassword = useCallback(() => {
    // Would open a password change modal or navigate
  }, []);

  return (
    <PageContainer className="py-12">
      <h1 className="mb-8 font-display text-5xl tracking-tight text-white md:text-6xl">
        Settings
      </h1>

      <div className="flex flex-col gap-8 md:flex-row md:gap-12">
        {/* Sidebar navigation */}
        <Sidebar items={SETTINGS_ITEMS} />

        {/* Security content */}
        <div className="flex-1">
          <SecuritySettings
            mfaEnabled={mfaEnabled}
            onEnableMfa={handleEnableMfa}
            onDisableMfa={handleDisableMfa}
            onChangePassword={handleChangePassword}
          />
        </div>
      </div>
    </PageContainer>
  );
}
