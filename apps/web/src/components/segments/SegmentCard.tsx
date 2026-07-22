'use client';

/**
 * SegmentCard — A route segment with its own mini-leaderboard.
 * Shows segment name, distance, and the current top user for fastest time.
 */
export interface SegmentLeaderEntry {
  displayName: string;
  time: string;
  avatarUrl?: string;
}

export interface SegmentCardProps {
  name: string;
  distance: string;
  topUser?: SegmentLeaderEntry;
  segmentId?: string;
  className?: string;
}

export default function SegmentCard({
  name,
  distance,
  topUser = { displayName: 'Alex Rivera', time: '4:32' },
  segmentId,
  className = '',
}: SegmentCardProps) {
  return (
    <div className={`card-3d rounded-xl border border-dark-gray/40 bg-surface p-5 ${className}`}>
      {/* Segment info */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
          <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
        <div>
          <h4 className="font-body text-sm font-semibold text-white">{name}</h4>
          <p className="font-body text-xs text-offwhite/50">{distance}</p>
        </div>
      </div>

      {/* Crown / top user */}
      <div className="rounded-lg bg-background/50 px-3 py-2">
        <p className="mb-1 font-body text-[10px] font-medium uppercase tracking-wide text-offwhite/40">
          👑 Fastest
        </p>
        <div className="flex items-center justify-between">
          <span className="font-body text-xs font-medium text-white">
            {topUser.displayName}
          </span>
          <span className="font-body text-xs font-bold text-gradient">
            {topUser.time}
          </span>
        </div>
      </div>

      {segmentId && (
        <a
          href={`/segments/${segmentId}`}
          className="mt-3 block font-body text-xs font-semibold text-primary hover:text-primary-light transition-colors"
        >
          View full leaderboard →
        </a>
      )}
    </div>
  );
}
