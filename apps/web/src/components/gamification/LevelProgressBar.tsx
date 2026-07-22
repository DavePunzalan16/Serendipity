/**
 * LevelProgressBar — XP progress toward next level with level indicator.
 */
export interface LevelProgressBarProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
  className?: string;
}

export default function LevelProgressBar({
  currentXP,
  nextLevelXP,
  level,
  className = '',
}: LevelProgressBarProps) {
  const percentage = Math.min((currentXP / nextLevelXP) * 100, 100);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary font-body text-xs font-bold text-black">
            {level}
          </span>
          <span className="font-body text-sm font-medium text-white">Level {level}</span>
        </div>
        <span className="font-body text-xs text-offwhite/60">
          {currentXP} / {nextLevelXP} XP
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-dark-gray/40">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={currentXP}
          aria-valuemin={0}
          aria-valuemax={nextLevelXP}
          aria-label={`Level ${level}: ${currentXP} of ${nextLevelXP} XP`}
        />
      </div>
    </div>
  );
}
