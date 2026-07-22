import Card from '../ui/Card';

/**
 * ChallengeCard — Active challenge with progress bar.
 */
export interface ChallengeCardProps {
  title: string;
  description: string;
  current: number;
  target: number;
  icon?: string;
  className?: string;
}

export default function ChallengeCard({
  title,
  description,
  current,
  target,
  icon = '🎯',
  className = '',
}: ChallengeCardProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;

  return (
    <Card className={className}>
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">{icon}</span>
        <div className="flex-1">
          <h4 className="font-body text-sm font-semibold text-white">{title}</h4>
          <p className="mt-0.5 font-body text-xs text-offwhite/60">{description}</p>

          {/* Progress bar */}
          <div className="mt-3 flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-dark-gray/40">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isComplete ? 'bg-green-500' : 'bg-primary'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="font-body text-xs font-medium text-offwhite/70">
              {current}/{target}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
