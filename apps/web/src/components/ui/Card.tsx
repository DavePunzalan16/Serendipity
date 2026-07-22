import type { ReactNode } from 'react';

/**
 * Card — Generic card wrapper with border and surface background.
 * Provides consistent card styling throughout the app.
 */
export interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`
        rounded-xl border border-dark-gray/40 bg-surface p-5
        ${hover ? 'transition-colors hover:border-dark-gray/70' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
