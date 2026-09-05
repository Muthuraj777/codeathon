import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  dot = false,
  className,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-tight border transition-colors select-none';

  const variants = {
    primary: 'bg-blue-50 text-blue-700 border-blue-200/90',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/90',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/90',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/90',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/90',
    info: 'bg-cyan-50 text-cyan-700 border-cyan-200/90',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const dotColors = {
    primary: 'bg-blue-600',
    purple: 'bg-purple-600',
    secondary: 'bg-slate-500',
    success: 'bg-emerald-600',
    warning: 'bg-amber-600',
    danger: 'bg-rose-600',
    info: 'bg-cyan-600',
    neutral: 'bg-slate-400',
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0 animate-pulse', dotColors[variant])} />}
      {children}
    </span>
  );
};
