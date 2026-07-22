/**
 * ProgressBar — Visual progress indicator showing stops visited vs total.
 */
export interface ProgressBarProps {
  visited: number;
  total: number;
  className?: string;
}

export default function ProgressBar({ visited, total, className = '' }: ProgressBarProps) {
  const percentage = total > 0 ? (visited / total) * 100 : 0;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="font-body text-xs text-offwhite/70">Progress</span>
        <span className="font-body text-xs font-semibold text-primary">
          {visited}/{total} stops
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-dark-gray/40">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={visited}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`${visited} of ${total} stops visited`}
        />
      </div>
    </div>
  );
}
