'use client';

import { useState } from 'react';
import LeaderboardRow from './LeaderboardRow';

/**
 * LeaderboardTable — Full ranked leaderboard with scope, period, and metric tabs.
 * Supports friends/global/club scope, weekly/monthly/all-time period,
 * and walks/distance/vibes metrics.
 */
export interface LeaderboardEntry {
  id: string;
  rank: number;
  avatarUrl?: string;
  displayName: string;
  statValue: string;
  rankChange?: 'up' | 'down' | 'same';
}

export type LeaderboardScope = 'friends' | 'global' | 'club';
export type LeaderboardPeriod = 'weekly' | 'monthly' | 'all-time';
export type LeaderboardMetric = 'walks' | 'distance' | 'vibes';

export interface LeaderboardTableProps {
  entries?: LeaderboardEntry[];
  defaultScope?: LeaderboardScope;
  defaultPeriod?: LeaderboardPeriod;
  defaultMetric?: LeaderboardMetric;
  onFilterChange?: (scope: LeaderboardScope, period: LeaderboardPeriod, metric: LeaderboardMetric) => void;
  className?: string;
}

const PLACEHOLDER_ENTRIES: LeaderboardEntry[] = [
  { id: '1', rank: 1, displayName: 'Alex Rivera', statValue: '42 walks', rankChange: 'up' },
  { id: '2', rank: 2, displayName: 'Jordan Lee', statValue: '38 walks', rankChange: 'same' },
  { id: '3', rank: 3, displayName: 'Sam Chen', statValue: '35 walks', rankChange: 'down' },
  { id: '4', rank: 4, displayName: 'Taylor Kim', statValue: '29 walks', rankChange: 'up' },
  { id: '5', rank: 5, displayName: 'Morgan Wu', statValue: '27 walks', rankChange: 'same' },
  { id: '6', rank: 6, displayName: 'Casey Park', statValue: '24 walks', rankChange: 'down' },
  { id: '7', rank: 7, displayName: 'Riley Nguyen', statValue: '21 walks', rankChange: 'up' },
];

export default function LeaderboardTable({
  entries = PLACEHOLDER_ENTRIES,
  defaultScope = 'friends',
  defaultPeriod = 'weekly',
  defaultMetric = 'walks',
  onFilterChange,
  className = '',
}: LeaderboardTableProps) {
  const [scope, setScope] = useState<LeaderboardScope>(defaultScope);
  const [period, setPeriod] = useState<LeaderboardPeriod>(defaultPeriod);
  const [metric, setMetric] = useState<LeaderboardMetric>(defaultMetric);

  const handleScopeChange = (s: LeaderboardScope) => {
    setScope(s);
    onFilterChange?.(s, period, metric);
  };

  const handlePeriodChange = (p: LeaderboardPeriod) => {
    setPeriod(p);
    onFilterChange?.(scope, p, metric);
  };

  const handleMetricChange = (m: LeaderboardMetric) => {
    setMetric(m);
    onFilterChange?.(scope, period, m);
  };

  const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 font-body text-xs font-medium transition-colors ${
        active
          ? 'bg-primary/20 text-primary'
          : 'text-offwhite/60 hover:text-offwhite'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className={`card-3d rounded-xl border border-dark-gray/40 bg-surface p-5 ${className}`}>
      {/* Header */}
      <h3 className="mb-4 font-body text-lg font-semibold text-white">
        <span className="text-gradient">Leaderboard</span>
      </h3>

      {/* Scope tabs */}
      <div className="mb-3 flex flex-wrap gap-1">
        {(['friends', 'global', 'club'] as LeaderboardScope[]).map((s) => (
          <TabButton key={s} active={scope === s} onClick={() => handleScopeChange(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </TabButton>
        ))}
      </div>

      {/* Period tabs */}
      <div className="mb-3 flex flex-wrap gap-1">
        {(['weekly', 'monthly', 'all-time'] as LeaderboardPeriod[]).map((p) => (
          <TabButton key={p} active={period === p} onClick={() => handlePeriodChange(p)}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </TabButton>
        ))}
      </div>

      {/* Metric tabs */}
      <div className="mb-4 flex flex-wrap gap-1">
        {(['walks', 'distance', 'vibes'] as LeaderboardMetric[]).map((m) => (
          <TabButton key={m} active={metric === m} onClick={() => handleMetricChange(m)}>
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </TabButton>
        ))}
      </div>

      {/* Entries */}
      <div className="space-y-1">
        {entries.map((entry) => (
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
