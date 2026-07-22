'use client';

/**
 * SegmentMap — Visual representation of a segment highlighted within a larger route.
 * Uses a colored overlay to distinguish the segment from the rest of the route.
 * In production, this would integrate with a map library (Mapbox/Leaflet).
 */
export interface SegmentMapProps {
  segmentName: string;
  segmentDistance: string;
  /** Placeholder route visualization — in production, accepts GeoJSON coordinates */
  highlighted?: boolean;
  className?: string;
}

export default function SegmentMap({
  segmentName,
  segmentDistance,
  highlighted = true,
  className = '',
}: SegmentMapProps) {
  return (
    <div className={`card-3d overflow-hidden rounded-xl border border-dark-gray/40 bg-surface ${className}`}>
      {/* Map placeholder */}
      <div className="relative h-48 w-full bg-background">
        {/* Simulated route path */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 200" preserveAspectRatio="none">
          {/* Full route (dimmed) */}
          <path
            d="M 20 150 Q 80 30, 150 100 T 280 60 T 380 120"
            fill="none"
            stroke="#374151"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Highlighted segment */}
          {highlighted && (
            <path
              d="M 150 100 Q 200 40, 280 60"
              fill="none"
              stroke="#00D26A"
              strokeWidth="4"
              strokeLinecap="round"
              className="drop-shadow-[0_0_6px_rgba(0,210,106,0.5)]"
            />
          )}
          {/* Start dot */}
          <circle cx="150" cy="100" r="5" fill="#00E5FF" />
          {/* End dot */}
          <circle cx="280" cy="60" r="5" fill="#00D26A" />
        </svg>

        {/* Segment label overlay */}
        <div className="absolute bottom-3 left-3 rounded-lg bg-surface/90 px-3 py-1.5 backdrop-blur-sm">
          <p className="font-body text-xs font-semibold text-gradient">{segmentName}</p>
          <p className="font-body text-[10px] text-offwhite/60">{segmentDistance}</p>
        </div>
      </div>
    </div>
  );
}
