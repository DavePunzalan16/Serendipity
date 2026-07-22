'use client';

import JoinClubButton from './JoinClubButton';

/**
 * ClubCard — Club preview card showing name, member count,
 * description snippet, and a join button.
 */
export interface ClubCardProps {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  joined?: boolean;
  coverEmoji?: string;
  onJoinToggle?: (clubId: string, joined: boolean) => void;
  className?: string;
}

export default function ClubCard({
  id,
  name,
  description,
  memberCount,
  joined = false,
  coverEmoji = '🚶',
  onJoinToggle,
  className = '',
}: ClubCardProps) {
  return (
    <div className={`card-3d rounded-xl border border-dark-gray/40 bg-surface p-5 ${className}`}>
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg">
            {coverEmoji}
          </span>
          <div>
            <h4 className="font-body text-sm font-semibold text-white">{name}</h4>
            <p className="font-body text-xs text-offwhite/50">{memberCount} members</p>
          </div>
        </div>
        <JoinClubButton clubId={id} initialJoined={joined} onToggle={onJoinToggle} />
      </div>

      {/* Description */}
      <p className="font-body text-xs leading-relaxed text-offwhite/70 line-clamp-2">
        {description}
      </p>
    </div>
  );
}
