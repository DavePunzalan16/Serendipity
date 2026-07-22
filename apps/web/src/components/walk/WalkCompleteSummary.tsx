import type { VibeTag } from '@wander/shared-types';
import Card from '../ui/Card';

/**
 * WalkCompleteSummary — Summary shown after walk completion.
 * Displays duration, distance, stops visited, and vibe tags.
 */
export interface WalkCompleteSummaryProps {
  title: string;
  durationMinutes: number;
  distanceKm: number;
  stopsVisited: number;
  totalStops: number;
  vibeTags: VibeTag[];
  completedAt: string;
  className?: string;
}

export default function WalkCompleteSummary({
  title,
  durationMinutes,
  distanceKm,
  stopsVisited,
  totalStops,
  vibeTags,
  completedAt,
  className = '',
}: WalkCompleteSummaryProps) {
  return (
    <Card className={`text-center ${className}`}>
      {/* Celebration icon */}
      <div className="mb-4 text-4xl" aria-hidden="true">
        🎉
      </div>

      <h2 className="mb-1 font-body text-xl font-semibold text-white">Walk Complete!</h2>
      <p className="mb-6 font-body text-sm text-offwhite/70">{title}</p>

      {/* Stats grid */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-background/50 p-3">
          <p className="font-body text-lg font-bold text-primary">{durationMinutes}m</p>
          <p className="font-body text-xs text-offwhite/60">Duration</p>
        </div>
        <div className="rounded-lg bg-background/50 p-3">
          <p className="font-body text-lg font-bold text-primary">{distanceKm.toFixed(1)}km</p>
          <p className="font-body text-xs text-offwhite/60">Distance</p>
        </div>
        <div className="rounded-lg bg-background/50 p-3">
          <p className="font-body text-lg font-bold text-primary">
            {stopsVisited}/{totalStops}
          </p>
          <p className="font-body text-xs text-offwhite/60">Stops</p>
        </div>
      </div>

      {/* Vibes */}
      {vibeTags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {vibeTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary/10 px-3 py-1 font-body text-xs font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="mt-4 font-body text-xs text-offwhite/50">
        Completed {new Date(completedAt).toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
    </Card>
  );
}
