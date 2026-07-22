'use client';

import { useState } from 'react';
import type { VibeTag } from '@wander/shared-types';
import Chip from '../ui/Chip';

/**
 * DiscoverFilters — Vibe filter chips, sort toggle, and distance slider for discovery page.
 */
export interface DiscoverFiltersProps {
  selectedVibe: VibeTag | null;
  onVibeChange: (vibe: VibeTag | null) => void;
  sort: 'recent' | 'popular';
  onSortChange: (sort: 'recent' | 'popular') => void;
  radiusKm: number;
  onRadiusChange: (km: number) => void;
  className?: string;
}

const VIBES: VibeTag[] = [
  'cozy', 'urban', 'nature', 'historic', 'artsy',
  'foodie', 'nightlife', 'scenic', 'adventure', 'hidden-gems',
];

export default function DiscoverFilters({
  selectedVibe,
  onVibeChange,
  sort,
  onSortChange,
  radiusKm,
  onRadiusChange,
  className = '',
}: DiscoverFiltersProps) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Vibe filter chips */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by vibe">
        <Chip
          label="All"
          selected={selectedVibe === null}
          onClick={() => onVibeChange(null)}
        />
        {VIBES.map((vibe) => (
          <Chip
            key={vibe}
            label={vibe}
            selected={selectedVibe === vibe}
            onClick={() => onVibeChange(selectedVibe === vibe ? null : vibe)}
          />
        ))}
      </div>

      {/* Sort + distance row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Sort toggle */}
        <div className="flex rounded-full border border-dark-gray/50 p-1">
          <button
            onClick={() => onSortChange('recent')}
            className={`rounded-full px-4 py-1.5 font-body text-xs font-medium transition-colors ${
              sort === 'recent'
                ? 'bg-primary text-black'
                : 'text-offwhite hover:text-white'
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => onSortChange('popular')}
            className={`rounded-full px-4 py-1.5 font-body text-xs font-medium transition-colors ${
              sort === 'popular'
                ? 'bg-primary text-black'
                : 'text-offwhite hover:text-white'
            }`}
          >
            Popular
          </button>
        </div>

        {/* Distance slider */}
        <div className="flex items-center gap-2">
          <label className="font-body text-xs text-offwhite/70">Within</label>
          <input
            type="range"
            min={1}
            max={50}
            value={radiusKm}
            onChange={(e) => onRadiusChange(Number(e.target.value))}
            className="h-1.5 w-24 cursor-pointer appearance-none rounded-full bg-dark-gray/60
              [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-primary"
            aria-label={`Search radius: ${radiusKm} km`}
          />
          <span className="font-body text-xs font-medium text-primary">{radiusKm} km</span>
        </div>
      </div>
    </div>
  );
}
