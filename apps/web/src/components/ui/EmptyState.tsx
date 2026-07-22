import type { ReactNode } from 'react';

/**
 * EmptyState — Centered empty state with icon, title, subtitle, and optional action button.
 * Used when a list or page has no content to display.
 */
export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({ icon, title, subtitle, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <h3 className="mb-2 font-body text-lg font-semibold text-white">{title}</h3>
      {subtitle && (
        <p className="mb-6 max-w-sm font-body text-sm text-offwhite/70">{subtitle}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
