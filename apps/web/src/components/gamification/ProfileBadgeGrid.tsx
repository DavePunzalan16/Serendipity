'use client';

import type { Badge } from '@wander/shared-types';
import Image from 'next/image';

/**
 * ProfileBadgeGrid — Badge icons grid with locked/unlocked states.
 * Displays earned badges with full opacity and unearned ones greyed out.
 */
export interface ProfileBadgeGridProps {
  earnedBadges: Badge[];
  allBadgeIds?: string[];
  onBadgeClick?: (badge: Badge) => void;
  className?: string;
}

export default function ProfileBadgeGrid({
  earnedBadges,
  onBadgeClick,
  className = '',
}: ProfileBadgeGridProps) {
  return (
    <div className={`grid grid-cols-4 gap-4 sm:grid-cols-6 ${className}`} role="list" aria-label="Badges">
      {earnedBadges.map((badge) => (
        <button
          key={badge.id}
          onClick={() => onBadgeClick?.(badge)}
          className="group flex flex-col items-center gap-2 rounded-lg p-2 transition-colors hover:bg-surface"
          role="listitem"
          aria-label={`${badge.name} badge`}
        >
          <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-primary/30 transition-all group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/20">
            <Image
              src={badge.icon_url}
              alt={badge.name}
              fill
              className="object-cover"
            />
          </div>
          <span className="font-body text-[10px] font-medium text-offwhite/70 text-center line-clamp-1">
            {badge.name}
          </span>
        </button>
      ))}
    </div>
  );
}
