'use client';

/**
 * Chip — Selectable pill chip used for vibe tags and filter selection.
 * Toggles between selected/unselected visual states.
 */
export interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Chip({ label, selected = false, onClick, className = '' }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center rounded-full border px-4 py-2
        font-body text-sm font-medium transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
        ${
          selected
            ? 'border-primary bg-primary/15 text-primary'
            : 'border-dark-gray bg-transparent text-offwhite hover:border-offwhite/50'
        }
        ${className}
      `}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}
