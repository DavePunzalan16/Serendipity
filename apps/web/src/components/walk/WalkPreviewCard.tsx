import type { VibeTag } from '@wander/shared-types';
import Card from '../ui/Card';

/**
 * WalkPreviewCard — Generated walk summary card showing key details.
 * Displayed after walk generation as a preview before starting.
 */
export interface WalkPreviewCardProps {
  title: string;
  narrative: string;
  vibeTags: VibeTag[];
  durationMinutes: number;
  distanceKm: number;
  stopCount: number;
  className?: string;
}

export default function WalkPreviewCard({
  title,
  narrative,
  vibeTags,
  durationMinutes,
  distanceKm,
  stopCount,
  className = '',
}: WalkPreviewCardProps) {
  return (
    <Card className={className}>
      <h3 className="mb-2 font-body text-lg font-semibold text-white">{title}</h3>
      <p className="mb-4 font-body text-sm leading-relaxed text-offwhite/80 line-clamp-3">
        {narrative}
      </p>

      {/* Stats */}
      <div className="mb-4 flex gap-4">
        <div className="flex items-center gap-1.5 font-body text-xs text-offwhite/70">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {durationMinutes} min
        </div>
        <div className="flex items-center gap-1.5 font-body text-xs text-offwhite/70">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          {distanceKm.toFixed(1)} km
        </div>
        <div className="flex items-center gap-1.5 font-body text-xs text-offwhite/70">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {stopCount} stops
        </div>
      </div>

      {/* Vibe tags */}
      {vibeTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
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
    </Card>
  );
}
