'use client';

import { useState } from 'react';

/**
 * NearbyFriendsBanner — Banner that appears when a friend starts a walk nearby.
 * Shows avatar, name, "started walking X min ago", and a dismiss button.
 */
export interface NearbyFriendsBannerProps {
  friendName: string;
  avatarUrl?: string;
  startedAgo?: string;
  onDismiss?: () => void;
  className?: string;
}

export default function NearbyFriendsBanner({
  friendName = 'Alex Rivera',
  avatarUrl,
  startedAgo = '2 min ago',
  onDismiss,
  className = '',
}: NearbyFriendsBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 ${className}`}
      role="alert"
    >
      {/* Avatar */}
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={friendName}
          className="h-9 w-9 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 font-body text-xs font-bold text-primary">
          {friendName.charAt(0)}
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        <p className="font-body text-sm font-medium text-white">{friendName}</p>
        <p className="font-body text-xs text-offwhite/50">
          Started walking {startedAgo} nearby
        </p>
      </div>

      {/* Pulsing indicator */}
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
      </span>

      {/* Dismiss */}
      <button
        onClick={handleDismiss}
        className="flex h-7 w-7 items-center justify-center rounded-full text-offwhite/50 transition-colors hover:bg-dark-gray/30 hover:text-white"
        aria-label="Dismiss"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
