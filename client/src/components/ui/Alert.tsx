import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ type = 'info', title, message, onClose, className }) => {
  const styles = {
    success: 'bg-emerald-50/90 border-emerald-200 text-emerald-900',
    error: 'bg-rose-50/90 border-rose-200 text-rose-900',
    warning: 'bg-amber-50/90 border-amber-200 text-amber-900',
    info: 'bg-blue-50/90 border-blue-200 text-blue-900',
  };

  const iconColors = {
    success: 'text-emerald-600',
    error: 'text-rose-600',
    warning: 'text-amber-600',
    info: 'text-blue-600',
  };

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const IconComponent = icons[type];

  return (
    <div
      className={cn(
        'p-4 rounded-2xl border backdrop-blur-md shadow-sm flex items-start justify-between gap-3 text-xs sm:text-sm animate-in fade-in slide-in-from-top-1 duration-200',
        styles[type],
        className
      )}
    >
      <div className="flex items-start gap-3">
        <IconComponent className={cn("w-5 h-5 shrink-0 mt-0.5", iconColors[type])} />
        <div className="space-y-0.5">
          {title && <h4 className="font-semibold tracking-tight">{title}</h4>}
          <p className="opacity-90 font-normal leading-relaxed">{message}</p>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 transition rounded-lg hover:bg-slate-200/50 shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
