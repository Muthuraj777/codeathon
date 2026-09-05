import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ className, children, variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 shadow-xs shadow-indigo-500/10',
    secondary: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
    success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-xs shadow-emerald-500/10',
    warning: 'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-xs shadow-amber-500/10',
    danger: 'bg-rose-500/10 text-rose-300 border-rose-500/30 shadow-xs shadow-rose-500/10',
    outline: 'bg-transparent text-slate-300 border-slate-700 hover:border-slate-500',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border backdrop-blur-xs transition-all duration-200',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
