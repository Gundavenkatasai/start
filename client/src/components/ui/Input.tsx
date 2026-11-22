import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftAddon, rightAddon, id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(7);

    return (
      <div className="w-full space-y-1.5 text-xs">
        {label && (
          <label htmlFor={inputId} className="block font-semibold text-ink-primary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-ink-muted">
              {leftAddon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white text-ink-primary placeholder:text-ink-muted transition-colors focus:outline-none focus:border-accent-cobalt focus:ring-1 focus:ring-accent-cobalt font-sans disabled:bg-surface-subtle disabled:opacity-60',
              leftAddon && 'pl-9',
              rightAddon && 'pr-9',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
              className
            )}
            {...props}
          />
          {rightAddon && (
            <div className="absolute right-3 flex items-center pointer-events-none text-ink-muted">
              {rightAddon}
            </div>
          )}
        </div>
        {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
        {helperText && !error && <p className="text-[11px] text-ink-muted">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
