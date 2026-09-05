import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, rightElement, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-zinc-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-zinc-500 pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={cn(
              'w-full glass-input text-zinc-100 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 transition duration-200 placeholder:text-zinc-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
              icon && 'pl-10',
              rightElement && 'pr-10',
              error && 'border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3.5 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="text-[11px] font-medium text-rose-400 animate-in fade-in">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
