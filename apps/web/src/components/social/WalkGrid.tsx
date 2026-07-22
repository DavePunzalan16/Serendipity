import type { Walk } from '@wander/shared-types';
import Card from '../ui/Card';
import Link from 'next/link';

/**
 * WalkGrid — Grid of walk cards for profile pages.
 */
export interface WalkGridProps {
  walks: Walk[];
  className?: string;
}

export default function WalkGrid({ walks, className = '' }: WalkGridProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {walks.map((walk) => (
        <Link key={walk.id} href={`/walk/${walk.id}`}>
          <Card hover>
            <h3 className="mb-1 font-body text-sm font-semibold text-white line-clamp-1">
              {walk.title}
            </h3>
            <p className="mb-3 font-body text-xs text-offwhite/60 line-clamp-2">
              {walk.narrative}
            </p>
            <div className="flex gap-3 font-body text-xs text-offwhite/50">
              <span>{walk.duration_minutes} min</span>
              <span>{walk.distance_km.toFixed(1)} km</span>
              <span>❤ {walk.like_count}</span>
            </div>
            {walk.vibe_tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {walk.vibe_tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 px-2 py-0.5 font-body text-[10px] font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Card>
        </Link>
      ))}
    </div>
  );
}
