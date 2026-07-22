'use client';

/**
 * WalkShareCard — Generates a shareable image-style preview of a walk.
 * Shows route thumbnail, stats, and narrative text.
 * Uses WandererCover.png as background template (in production).
 */
export interface WalkShareCardProps {
  walkTitle: string;
  distance: string;
  duration: string;
  steps: string;
  narrative?: string;
  routeThumbnailUrl?: string;
  username: string;
  date: string;
  className?: string;
}

export default function WalkShareCard({
  walkTitle,
  distance,
  duration,
  steps,
  narrative,
  routeThumbnailUrl,
  username,
  date,
  className = '',
}: WalkShareCardProps) {
  return (
    <div
      className={`card-3d relative overflow-hidden rounded-2xl border border-dark-gray/40 bg-gradient-to-br from-surface via-background to-surface p-6 ${className}`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[radial-gradient(#00D26A_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <span className="font-body text-xs font-bold uppercase tracking-widest text-primary">
            Wanderer
          </span>
          <span className="font-body text-[10px] text-offwhite/40">{date}</span>
        </div>

        {/* Walk title */}
        <h3 className="mb-3 font-body text-lg font-bold text-white">{walkTitle}</h3>

        {/* Route thumbnail placeholder */}
        {routeThumbnailUrl ? (
          <img
            src={routeThumbnailUrl}
            alt="Route map"
            className="mb-4 h-32 w-full rounded-lg object-cover"
          />
        ) : (
          <div className="mb-4 flex h-32 w-full items-center justify-center rounded-lg bg-background/80">
            <svg className="h-16 w-16 text-primary/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
        )}

        {/* Stats */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-background/60 px-3 py-2 text-center">
            <p className="font-body text-lg font-bold text-gradient">{distance}</p>
            <p className="font-body text-[10px] text-offwhite/50">Distance</p>
          </div>
          <div className="rounded-lg bg-background/60 px-3 py-2 text-center">
            <p className="font-body text-lg font-bold text-white">{duration}</p>
            <p className="font-body text-[10px] text-offwhite/50">Duration</p>
          </div>
          <div className="rounded-lg bg-background/60 px-3 py-2 text-center">
            <p className="font-body text-lg font-bold text-white">{steps}</p>
            <p className="font-body text-[10px] text-offwhite/50">Steps</p>
          </div>
        </div>

        {/* Narrative */}
        {narrative && (
          <p className="mb-4 font-body text-xs italic leading-relaxed text-offwhite/60">
            "{narrative}"
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-dark-gray/30 pt-3">
          <span className="font-body text-xs font-medium text-offwhite/70">@{username}</span>
          <span className="font-body text-[10px] text-offwhite/30">wanderer.app</span>
        </div>
      </div>
    </div>
  );
}
