'use client';

/**
 * TimeSlider — Range slider for walk duration selection (15-120 minutes).
 * Displays current value with formatted label.
 */
export interface TimeSliderProps {
  value: number;
  onChange: (minutes: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export default function TimeSlider({
  value,
  onChange,
  min = 15,
  max = 120,
  step = 5,
  className = '',
}: TimeSliderProps) {
  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins ? `${hrs}h ${mins}m` : `${hrs}h`;
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="font-body text-sm font-medium text-offwhite">
          Duration
        </label>
        <span className="font-body text-sm font-semibold text-primary">
          {formatTime(value)}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-dark-gray/60
            [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
          style={{
            background: `linear-gradient(to right, #C3B1FF ${percentage}%, #484848 ${percentage}%)`,
          }}
          aria-label={`Walk duration: ${formatTime(value)}`}
        />
      </div>
      <div className="flex justify-between font-body text-xs text-offwhite/50">
        <span>{formatTime(min)}</span>
        <span>{formatTime(max)}</span>
      </div>
    </div>
  );
}
