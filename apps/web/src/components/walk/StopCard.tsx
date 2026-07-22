import type { Stop } from '@wander/shared-types';

/**
 * StopCard — Single stop in a walk with number badge, name, and description.
 * Shows visited state with visual indicator.
 */
export interface StopCardProps {
  stop: Stop;
  index: number;
  className?: string;
}

export default function StopCard({ stop, index, className = '' }: StopCardProps) {
  return (
    <div className={`flex gap-4 ${className}`}>
      {/* Number badge */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-body text-sm font-bold ${
          stop.visited
            ? 'bg-primary text-black'
            : 'border border-dark-gray bg-surface text-offwhite'
        }`}
      >
        {index + 1}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h4
          className={`font-body text-sm font-semibold ${
            stop.visited ? 'text-white' : 'text-offwhite'
          }`}
        >
          {stop.name}
        </h4>
        <p className="mt-1 font-body text-xs leading-relaxed text-offwhite/60">
          {stop.description}
        </p>
        {stop.visited && stop.visited_at && (
          <p className="mt-1 font-body text-xs text-primary/70">
            Visited at{' '}
            {new Date(stop.visited_at).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>
    </div>
  );
}
