'use client';

import LeaderboardRow from './LeaderboardRow';
import type { LeaderboardEntry } from './LeaderboardTable';

/**
 * WeeklyLeaderboardWidget — Compact top-5 leaderboard for feed/home sidebar.
 * Mini version of LeaderboardTable showing only the current week's top performers.
 */
export interface WeeklyLeaderboardWidgetProps {
  entries?: LeaderboardEntry[];
  className?: string;
}

const PLACEHOLDER_TOP5: LeaderboardEntry[] = [
  { id: '1', rank: 1, displayName: 'Alex Rivera', statValue: '14.2 km', rankChange: 'up' },
  { id: '2', rank: 2, displayName: 'Jordan Lee', statValue: '12.8 km', rankChange: 'same' },
  { id: '3', rank: 3, displayName: 'Sam Chen', statValue: '11.5 km', rankChange: 'up' },
  { id: '4', rank: 4, displayName: 'Taylor Kim', statValue: '9.7 km', rankChange: 'down' },
  { id: '5', rank: 5, displayName: 'Morgan Wu', statValue: '8.3 km', rankChange: 'same' },
];

export default function WeeklyLeaderboardWidget({
  entries = PLACEHOLDER_TOP5,
  className = '',
}: WeeklyLeaderboardWidgetProps) {
  return (
    <div className={`card-3d rounded-xl border border-dark-gray/40 bg-surface p-4 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-body text-sm font-semibold text-white">
          <span className="text-gradient">This Week</span>
        </h4>
        <span className="font-body text-xs text-offwhite/50">Top 5</span>
      </div>

      <div className="space-y-0.5">
        {entries.slice(0, 5).map((entry) => (
          <LeaderboardRow
            key={entry.id}
            rank={entry.rank}
            avatarUrl={entry.avatarUrl}
            displayName={entry.displayName}
            statValue={entry.statValue}
            rankChange={entry.rankChange}
          />
        ))}
      </div>
    </div>
  );
}
