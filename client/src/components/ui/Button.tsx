import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'glow';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'primary', size = 'md', isLoading = false, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-[0.98] select-none';

    const variants = {
      primary:
        'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 border border-indigo-500/40 focus-visible:ring-indigo-500',
      secondary:
        'bg-zinc-800/90 text-zinc-100 hover:bg-zinc-700/90 border border-zinc-700/80 focus-visible:ring-zinc-700 shadow-sm',
      outline:
        'border border-zinc-800 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-800/90 hover:text-white hover:border-zinc-700 focus-visible:ring-indigo-500 backdrop-blur-md',
      ghost: 'bg-transparent text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100 focus-visible:ring-zinc-800',
      danger:
        'bg-rose-600/90 text-white hover:bg-rose-500 focus-visible:ring-rose-500 shadow-md shadow-rose-600/20 border border-rose-500/30',
      success:
        'bg-emerald-600/90 text-white hover:bg-emerald-500 focus-visible:ring-emerald-500 shadow-md shadow-emerald-600/20 border border-emerald-500/30',
      glow:
        'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white hover:opacity-95 shadow-lg shadow-indigo-500/25 border border-white/20 focus-visible:ring-purple-500',
    };

    const sizes = {
      xs: 'h-7 px-2.5 text-[11px] font-medium rounded-lg',
      sm: 'h-8.5 px-3.5 text-xs font-medium rounded-lg',
      md: 'h-10 px-4 py-2 text-xs sm:text-sm font-medium rounded-xl',
      lg: 'h-11.5 px-6 py-3 text-sm font-semibold rounded-xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin text-current shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
