import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'primary', size = 'md', isLoading = false, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-[0.98]';

    const variants = {
      primary:
        'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 focus-visible:ring-indigo-500 shadow-lg shadow-indigo-500/25 border border-indigo-400/30',
      secondary:
        'bg-slate-800/90 text-slate-100 hover:bg-slate-700/90 border border-slate-700/80 focus-visible:ring-slate-700 shadow-sm',
      outline:
        'border border-slate-700/80 bg-slate-900/60 text-slate-200 hover:bg-slate-800/80 hover:text-white focus-visible:ring-indigo-500 backdrop-blur-xs',
      ghost: 'bg-transparent text-slate-300 hover:bg-slate-800/60 hover:text-white focus-visible:ring-slate-700',
      danger:
        'bg-gradient-to-r from-rose-600 to-red-600 text-white hover:from-rose-500 hover:to-red-500 focus-visible:ring-rose-500 shadow-md shadow-rose-500/20 border border-rose-400/30',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2 text-xs sm:text-sm',
      lg: 'h-12 px-6 py-3 text-sm font-bold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
