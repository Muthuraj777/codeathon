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
    success: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200 icon-color text-emerald-400',
    error: 'bg-rose-950/40 border-rose-500/30 text-rose-200 icon-color text-rose-400',
    warning: 'bg-amber-950/40 border-amber-500/30 text-amber-200 icon-color text-amber-400',
    info: 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200 icon-color text-indigo-400',
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
        'p-4 rounded-2xl border backdrop-blur-xl shadow-lg flex items-start justify-between gap-3 text-xs sm:text-sm animate-in fade-in slide-in-from-top-1 duration-200',
        styles[type],
        className
      )}
    >
      <div className="flex items-start gap-3">
        <IconComponent className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          {title && <h4 className="font-bold tracking-tight">{title}</h4>}
          <p className="opacity-90 font-normal leading-relaxed">{message}</p>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 transition rounded-lg hover:bg-white/10 shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
