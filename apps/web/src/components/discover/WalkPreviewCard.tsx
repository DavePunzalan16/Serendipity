import type { WalkMapItem } from '@wander/shared-types';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';

/**
 * WalkPreviewCard — Card for discovered walks on the discovery page.
 * Shows walk details with user info and engagement stats.
 */
export interface DiscoverWalkPreviewCardProps {
  walk: WalkMapItem;
  className?: string;
}

export default function WalkPreviewCard({ walk, className = '' }: DiscoverWalkPreviewCardProps) {
  return (
    <Card hover className={className}>
      {/* User row */}
      <div className="mb-3 flex items-center gap-2">
        <Avatar
          src={walk.user.avatar_url}
          alt={walk.user.display_name || walk.user.username}
          size="sm"
        />
        <span className="font-body text-sm font-medium text-white">
          {walk.user.display_name || `@${walk.user.username}`}
        </span>
      </div>

      {/* Walk title */}
      <h3 className="mb-2 font-body text-base font-semibold text-white">{walk.title}</h3>

      {/* Stats row */}
      <div className="mb-3 flex gap-4 font-body text-xs text-offwhite/70">
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {walk.duration_minutes} min
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          {walk.distance_km.toFixed(1)} km
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {walk.like_count}
        </span>
      </div>

      {/* Vibe tags */}
      {walk.vibe_tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {walk.vibe_tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary/10 px-2.5 py-0.5 font-body text-xs font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
