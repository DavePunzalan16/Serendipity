/**
 * Skeleton — Animated loading placeholder with shimmer effect.
 * Renders as a rectangular placeholder that pulses to indicate loading.
 */
export interface SkeletonProps {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

const roundedMap: Record<NonNullable<SkeletonProps['rounded']>, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export default function Skeleton({ className = '', rounded = 'md' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-dark-gray/40 ${roundedMap[rounded]} ${className}`}
      aria-hidden="true"
    />
  );
}
