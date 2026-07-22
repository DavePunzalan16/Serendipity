'use client';

/**
 * StatsHeatmap — GitHub contribution graph style heatmap for walk activity.
 * 52 columns × 7 rows grid. Each cell is colored by intensity
 * (0 walks = dark, more walks = brighter green). Shows current streak.
 */
export interface StatsHeatmapProps {
  /** 364-element array (52 weeks × 7 days) of walk counts per day */
  data?: number[];
  currentStreak?: number;
  className?: string;
}

/** Generate placeholder data simulating a year of walks */
function generatePlaceholderData(): number[] {
  return Array.from({ length: 364 }, () =>
    Math.random() > 0.4 ? Math.floor(Math.random() * 4) : 0
  );
}

function getIntensityClass(count: number): string {
  if (count === 0) return 'bg-dark-gray/30';
  if (count === 1) return 'bg-primary/30';
  if (count === 2) return 'bg-primary/60';
  return 'bg-primary';
}

export default function StatsHeatmap({
  data,
  currentStreak = 7,
  className = '',
}: StatsHeatmapProps) {
  const heatmapData = data ?? generatePlaceholderData();

  // Build 52 columns of 7 rows
  const weeks: number[][] = [];
  for (let w = 0; w < 52; w++) {
    weeks.push(heatmapData.slice(w * 7, w * 7 + 7));
  }

  return (
    <div className={`card-3d rounded-xl border border-dark-gray/40 bg-surface p-5 ${className}`}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-body text-sm font-semibold text-white">Activity</h4>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="font-body text-xs font-medium text-primary">
            {currentStreak} day streak
          </span>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto">
        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((count, di) => (
                <div
                  key={`${wi}-${di}`}
                  className={`h-[11px] w-[11px] rounded-sm ${getIntensityClass(count)}`}
                  title={`${count} walk${count !== 1 ? 's' : ''}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-end gap-1">
        <span className="font-body text-[10px] text-offwhite/40">Less</span>
        <div className="h-[10px] w-[10px] rounded-sm bg-dark-gray/30" />
        <div className="h-[10px] w-[10px] rounded-sm bg-primary/30" />
        <div className="h-[10px] w-[10px] rounded-sm bg-primary/60" />
        <div className="h-[10px] w-[10px] rounded-sm bg-primary" />
        <span className="font-body text-[10px] text-offwhite/40">More</span>
      </div>
    </div>
  );
}
