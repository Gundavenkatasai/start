import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'emerald' | 'subtle';
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
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.99] select-none';

    const variants = {
      primary:
        'bg-accent-cobalt text-white hover:bg-accent-cobalt-hover shadow-sm hover:shadow-glow focus-visible:ring-accent-cobalt',
      secondary:
        'bg-white text-ink-primary hover:bg-surface-subtle border border-surface-border shadow-subtle hover:border-slate-300 focus-visible:ring-accent-cobalt',
      subtle:
        'bg-surface-secondary text-ink-secondary hover:text-ink-primary hover:bg-surface-border/60 border border-transparent focus-visible:ring-ink-muted',
      outline:
        'border border-surface-border bg-white text-ink-primary hover:bg-surface-subtle hover:border-slate-300 focus-visible:ring-accent-cobalt shadow-card',
      ghost:
        'text-ink-secondary hover:text-ink-primary hover:bg-surface-secondary/70 focus-visible:ring-ink-muted',
      danger:
        'bg-accent-rose text-white hover:bg-accent-rose-hover shadow-sm focus-visible:ring-accent-rose',
      emerald:
        'bg-accent-emerald text-white hover:bg-accent-emerald-hover shadow-sm focus-visible:ring-accent-emerald',
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
