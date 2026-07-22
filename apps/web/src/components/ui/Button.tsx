'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';

/**
 * Button — Primary UI button with multiple variants and sizes.
 * Supports loading state with spinner animation.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-primary text-black hover:bg-primary/90 focus-visible:ring-primary/50',
  secondary:
    'bg-surface border border-dark-gray text-offwhite hover:bg-dark-gray/30 focus-visible:ring-dark-gray/50',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/50',
  ghost:
    'bg-transparent text-offwhite hover:bg-surface focus-visible:ring-primary/50',
};

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-full',
  md: 'px-5 py-2.5 text-base rounded-full',
  lg: 'px-7 py-3.5 text-base rounded-full',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, disabled, className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-2 font-body font-bold uppercase
          transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]} ${sizeStyles[size]} ${className}
        `}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
