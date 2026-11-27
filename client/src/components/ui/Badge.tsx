import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'purple' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-surface-secondary text-ink-secondary border-surface-border',
    primary: 'bg-accent-cobalt-light text-accent-cobalt border-accent-cobalt-border',
    secondary: 'bg-surface-subtle text-ink-primary border-surface-border',
    success: 'bg-accent-emerald-light text-accent-emerald border-accent-emerald-border',
    warning: 'bg-accent-amber-light text-accent-amber border-accent-amber-border',
    danger: 'bg-accent-rose-light text-accent-rose border-accent-rose-border',
    purple: 'bg-accent-purple-light text-accent-purple border-accent-purple-border',
    outline: 'bg-white text-ink-secondary border-surface-border',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] font-mono tracking-wide',
    md: 'px-2.5 py-0.5 text-xs font-mono tracking-wide',
  };

  const dotColors = {
    default: 'bg-ink-muted',
    primary: 'bg-accent-cobalt',
    secondary: 'bg-ink-secondary',
    success: 'bg-accent-emerald',
    warning: 'bg-accent-amber',
    danger: 'bg-accent-rose',
    purple: 'bg-accent-purple',
    outline: 'bg-ink-muted',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            dotColors[variant],
            pulse && 'animate-pulse'
          )}
        />
      )}
      {children}
    </span>
  );
};
