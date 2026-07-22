import type { Stop } from '@wander/shared-types';
import StopCard from './StopCard';

/**
 * StopList — List of StopCards with connecting lines between them.
 * Visualizes walk progress through stops.
 */
export interface StopListProps {
  stops: Stop[];
  className?: string;
}

export default function StopList({ stops, className = '' }: StopListProps) {
  const sortedStops = [...stops].sort((a, b) => a.order_index - b.order_index);

  return (
    <div className={`relative flex flex-col ${className}`}>
      {sortedStops.map((stop, index) => (
        <div key={stop.id} className="relative">
          {/* Connecting line */}
          {index < sortedStops.length - 1 && (
            <div
              className={`absolute left-[15px] top-8 h-full w-0.5 ${
                stop.visited ? 'bg-primary/40' : 'bg-dark-gray/40'
              }`}
              aria-hidden="true"
            />
          )}
          <div className="relative pb-6">
            <StopCard stop={stop} index={index} />
          </div>
        </div>
      ))}
    </div>
  );
}
