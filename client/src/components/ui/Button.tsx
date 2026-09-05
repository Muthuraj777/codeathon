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
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100 disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-[0.98] select-none';

    const variants = {
      primary:
        'bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 border border-blue-600/40 focus-visible:ring-blue-600',
      secondary:
        'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200/90 focus-visible:ring-slate-300 shadow-2xs',
      outline:
        'border border-slate-200 bg-white/80 text-slate-700 hover:bg-white hover:text-slate-900 hover:border-slate-300 focus-visible:ring-blue-600 backdrop-blur-md',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-200',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-600 shadow-sm shadow-rose-600/20 border border-rose-500/30',
      success:
        'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-600 shadow-sm shadow-emerald-600/20 border border-emerald-500/30',
      glow:
        'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white hover:opacity-95 shadow-md shadow-blue-600/25 border border-blue-400/30 focus-visible:ring-blue-600',
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
