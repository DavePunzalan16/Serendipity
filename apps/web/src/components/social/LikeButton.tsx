'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import LikeBurst from '../motion/LikeBurst';

/**
 * LikeButton — Animated like/unlike button with burst effect.
 * Extracted for reuse across feed cards and walk detail pages.
 */
export interface LikeButtonProps {
  liked: boolean;
  count: number;
  onToggle: (liked: boolean) => void;
}

export default function LikeButton({ liked: initialLiked, count: initialCount, onToggle }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [showBurst, setShowBurst] = useState(false);

  const handleClick = useCallback(() => {
    const newLiked = !liked;
    setLiked(newLiked);
    setCount((prev) => (newLiked ? prev + 1 : prev - 1));

    if (newLiked) {
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 600);
    }

    onToggle(newLiked);
  }, [liked, onToggle]);

  return (
    <button
      onClick={handleClick}
      className="relative flex items-center gap-1.5 font-body text-sm transition-colors"
      aria-label={liked ? 'Unlike this walk' : 'Like this walk'}
    >
      <motion.svg
        viewBox="0 0 24 24"
        className={`h-5 w-5 ${liked ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-offwhite'}`}
        strokeWidth={2}
        whileTap={{ scale: 1.3 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      </motion.svg>
      <span className={liked ? 'text-red-400' : 'text-offwhite/70'}>{count}</span>
      <LikeBurst isActive={showBurst} />
    </button>
  );
}
