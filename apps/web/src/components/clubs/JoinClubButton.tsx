'use client';

import { useState } from 'react';

/**
 * JoinClubButton — Toggle button for joining/leaving a club.
 * Switches between Join and Leave states with visual feedback.
 */
export interface JoinClubButtonProps {
  clubId: string;
  initialJoined?: boolean;
  onToggle?: (clubId: string, joined: boolean) => void;
  className?: string;
}

export default function JoinClubButton({
  clubId,
  initialJoined = false,
  onToggle,
  className = '',
}: JoinClubButtonProps) {
  const [joined, setJoined] = useState(initialJoined);

  const handleClick = () => {
    const next = !joined;
    setJoined(next);
    onToggle?.(clubId, next);
  };

  return (
    <button
      onClick={handleClick}
      className={`rounded-full px-4 py-1.5 font-body text-xs font-bold uppercase tracking-wide transition-all ${
        joined
          ? 'border border-dark-gray/60 bg-transparent text-offwhite hover:border-red-400 hover:text-red-400'
          : 'bg-primary text-background hover:bg-primary-light'
      } ${className}`}
    >
      {joined ? 'Leave' : 'Join'}
    </button>
  );
}
