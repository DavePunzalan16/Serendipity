'use client';

import type { NotificationPreferences as NotifPrefs } from '@wander/shared-types';
import Card from '../ui/Card';

/**
 * NotificationPreferences — Toggle switches for notification settings.
 */
export interface NotificationPreferencesProps {
  preferences: NotifPrefs;
  onChange: (key: keyof NotifPrefs, value: boolean) => void;
  className?: string;
}

const labels: Record<keyof NotifPrefs, { title: string; description: string }> = {
  new_follower: {
    title: 'New Follower',
    description: 'Someone follows you',
  },
  walk_liked: {
    title: 'Walk Liked',
    description: 'Someone likes your walk',
  },
  walk_commented: {
    title: 'Walk Comment',
    description: 'Someone comments on your walk',
  },
  stop_arrival: {
    title: 'Stop Arrival',
    description: 'Notification when arriving at a stop',
  },
};

export default function NotificationPreferences({
  preferences,
  onChange,
  className = '',
}: NotificationPreferencesProps) {
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <h2 className="font-body text-lg font-semibold text-white">Notifications</h2>

      <Card>
        <div className="flex flex-col divide-y divide-dark-gray/30">
          {(Object.keys(labels) as Array<keyof NotifPrefs>).map((key) => (
            <div key={key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div>
                <h3 className="font-body text-sm font-medium text-white">
                  {labels[key].title}
                </h3>
                <p className="font-body text-xs text-offwhite/60">
                  {labels[key].description}
                </p>
              </div>
              <button
                role="switch"
                aria-checked={preferences[key]}
                aria-label={`${labels[key].title} notifications`}
                onClick={() => onChange(key, !preferences[key])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences[key] ? 'bg-primary' : 'bg-dark-gray'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences[key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
