'use client';

import Button from '../ui/Button';

/**
 * WalkThisRouteButton — CTA button to start walking a discovered route.
 */
export interface WalkThisRouteButtonProps {
  walkId: string;
  onClick: (walkId: string) => void;
  loading?: boolean;
  className?: string;
}

export default function WalkThisRouteButton({
  walkId,
  onClick,
  loading = false,
  className = '',
}: WalkThisRouteButtonProps) {
  return (
    <Button
      onClick={() => onClick(walkId)}
      loading={loading}
      className={`w-full ${className}`}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
        />
      </svg>
      Walk This Route
    </Button>
  );
}
