'use client';

import Avatar from '../ui/Avatar';

/**
 * LeaderboardRow — Single row in a leaderboard table.
 * Shows rank (gold/silver/bronze for top 3), avatar, display name,
 * stat value, and rank-change indicator.
 */
export interface LeaderboardRowProps {
  rank: number;
  avatarUrl?: string;
  displayName: string;
  statValue: string;
  rankChange?: 'up' | 'down' | 'same';
  className?: string;
}

const rankMedals: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

export default function LeaderboardRow({
  rank,
  avatarUrl,
  displayName,
  statValue,
  rankChange = 'same',
  className = '',
}: LeaderboardRowProps) {
  const changeIndicator = {
    up: <span className="text-primary text-sm font-bold">↑</span>,
    down: <span className="text-red-400 text-sm font-bold">↓</span>,
    same: <span className="text-gray-500 text-sm">—</span>,
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-surface-elevated/50 ${className}`}
    >
      {/* Rank */}
      <div className="w-8 text-center font-body text-sm font-bold text-offwhite">
        {rankMedals[rank] ?? rank}
      </div>

      {/* Avatar */}
      <Avatar
        src={avatarUrl}
        alt={displayName}
        size="sm"
      />

      {/* Name */}
      <span className="flex-1 truncate font-body text-sm font-medium text-white">
        {displayName}
      </span>

      {/* Stat */}
      <span className="font-body text-sm font-semibold text-primary">
        {statValue}
      </span>

      {/* Rank change */}
      <div className="w-5 text-center">{changeIndicator[rankChange]}</div>
    </div>
  );
}
