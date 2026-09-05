import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', label, className }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 p-4', className)}>
      <Loader2 className={cn('animate-spin text-[#2563EB]', sizes[size])} />
      {label && <p className="text-xs font-medium text-slate-500 tracking-tight">{label}</p>}
    </div>
  );
};
