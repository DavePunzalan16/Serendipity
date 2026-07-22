'use client';

/**
 * PersonalRecordCard — Displays a single personal record (PR).
 * Shows record type, value, date achieved, and an optional walk link.
 */
export interface PersonalRecordCardProps {
  recordType: string;
  value: string;
  dateSet: string;
  walkId?: string;
  icon?: string;
  className?: string;
}

export default function PersonalRecordCard({
  recordType,
  value,
  dateSet,
  walkId,
  icon = '🏆',
  className = '',
}: PersonalRecordCardProps) {
  return (
    <div
      className={`card-3d rounded-xl border border-dark-gray/40 bg-surface p-5 ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">{icon}</span>
        <div className="flex-1">
          <p className="font-body text-xs font-medium uppercase tracking-wide text-offwhite/60">
            {recordType}
          </p>
          <p className="mt-1 font-body text-xl font-bold text-gradient">
            {value}
          </p>
          <p className="mt-1 font-body text-xs text-offwhite/50">
            Set on {dateSet}
          </p>
          {walkId && (
            <a
              href={`/walk/${walkId}`}
              className="mt-2 inline-block font-body text-xs font-semibold text-primary hover:text-primary-light transition-colors"
            >
              View walk →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
