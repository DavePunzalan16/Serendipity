'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

/**
 * Input — Labeled text input with error state.
 * Uses dark surface background with offwhite text per theme.
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-2">
        <label
          htmlFor={inputId}
          className="font-body text-sm font-medium text-offwhite"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`
            rounded-sm bg-surface px-4 py-3 font-body text-base text-white
            placeholder:text-offwhite/40 border transition-colors
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
            ${error ? 'border-red-500' : 'border-dark-gray/50'}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="font-body text-xs text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
