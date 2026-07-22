'use client';

/**
 * LiveActivityIndicator — "X friends walking right now" ticker.
 * Green pulsing dot with text. In production, would use Supabase Realtime
 * for live presence data.
 */
export interface LiveActivityIndicatorProps {
  activeCount?: number;
  className?: string;
}

export default function LiveActivityIndicator({
  activeCount = 3,
  className = '',
}: LiveActivityIndicatorProps) {
  if (activeCount === 0) return null;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 ${className}`}
    >
      {/* Pulsing green dot */}
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
      </span>

      {/* Text */}
      <span className="font-body text-xs font-medium text-primary">
        {activeCount} friend{activeCount !== 1 ? 's' : ''} walking right now
      </span>
    </div>
  );
}
