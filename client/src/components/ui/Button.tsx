import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

    const variants = {
      primary:
        'bg-accent-cobalt text-white hover:bg-accent-cobalt-hover shadow-sm focus-visible:ring-accent-cobalt',
      secondary:
        'bg-surface-secondary text-ink-primary hover:bg-surface-border border border-surface-border focus-visible:ring-ink-muted',
      outline:
        'border border-surface-border bg-white text-ink-primary hover:bg-surface-subtle focus-visible:ring-accent-cobalt shadow-card',
      ghost:
        'text-ink-secondary hover:text-ink-primary hover:bg-surface-subtle focus-visible:ring-ink-muted',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 shadow-sm focus-visible:ring-rose-600',
      emerald:
        'bg-accent-emerald text-white hover:bg-emerald-700 shadow-sm focus-visible:ring-accent-emerald',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-xs sm:text-sm gap-2',
      lg: 'px-5 py-2.5 text-sm sm:text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {!isLoading && leftIcon}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
