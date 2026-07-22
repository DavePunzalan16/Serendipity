'use client';

import type { VibeTag } from '@wander/shared-types';
import Chip from '../ui/Chip';

/**
 * VibeChips — Multi-select vibe tag chips for walk generation.
 * Allows selecting multiple vibe tags that define the walk mood.
 */
export interface VibeChipsProps {
  selected: VibeTag[];
  onChange: (tags: VibeTag[]) => void;
  className?: string;
}

const ALL_VIBES: VibeTag[] = [
  'cozy',
  'urban',
  'nature',
  'historic',
  'artsy',
  'foodie',
  'nightlife',
  'scenic',
  'adventure',
  'hidden-gems',
];

const vibeEmoji: Record<VibeTag, string> = {
  cozy: '☕',
  urban: '🏙️',
  nature: '🌿',
  historic: '🏛️',
  artsy: '🎨',
  foodie: '🍜',
  nightlife: '🌙',
  scenic: '📸',
  adventure: '🧭',
  'hidden-gems': '💎',
};

export default function VibeChips({ selected, onChange, className = '' }: VibeChipsProps) {
  const toggleVibe = (vibe: VibeTag) => {
    if (selected.includes(vibe)) {
      onChange(selected.filter((v) => v !== vibe));
    } else {
      onChange([...selected, vibe]);
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`} role="group" aria-label="Vibe tags">
      {ALL_VIBES.map((vibe) => (
        <Chip
          key={vibe}
          label={`${vibeEmoji[vibe]} ${vibe}`}
          selected={selected.includes(vibe)}
          onClick={() => toggleVibe(vibe)}
        />
      ))}
    </div>
  );
}
