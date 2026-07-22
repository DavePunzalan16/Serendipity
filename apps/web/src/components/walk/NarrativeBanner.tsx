'use client';

import { useState } from 'react';

/**
 * NarrativeBanner — Expandable walk narrative banner.
 * Shows truncated narrative with expand/collapse toggle.
 */
export interface NarrativeBannerProps {
  narrative: string;
  className?: string;
}

export default function NarrativeBanner({ narrative, className = '' }: NarrativeBannerProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = narrative.length > 200;

  return (
    <div
      className={`rounded-xl border border-primary/20 bg-primary/5 p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <svg
          className="mt-0.5 h-5 w-5 shrink-0 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <div className="flex-1">
          <p
            className={`font-body text-sm leading-relaxed text-offwhite/90 ${
              !expanded && isLong ? 'line-clamp-3' : ''
            }`}
          >
            {narrative}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 font-body text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
