/**
 * MapPlaceholder — Placeholder component for future Google Maps integration.
 * Displays a styled placeholder with map icon.
 */
export interface MapPlaceholderProps {
  className?: string;
  height?: string;
}

export default function MapPlaceholder({ className = '', height = 'h-64' }: MapPlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl border border-dashed border-dark-gray/60 bg-surface/50 ${height} ${className}`}
      role="img"
      aria-label="Map placeholder - coming soon"
    >
      <div className="flex flex-col items-center gap-3 text-offwhite/40">
        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
          />
        </svg>
        <span className="font-body text-sm">Map coming soon</span>
      </div>
    </div>
  );
}
