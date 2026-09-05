import React from 'react';
import { cn } from '../../lib/utils';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  className?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type = 'error', title, message, className, onClose }) => {
  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-rose-50 border-rose-200 text-rose-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
    error: <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />,
  };

  return (
    <div className={cn('flex items-start gap-3 p-4 rounded-lg border text-sm', styles[type], className)} role="alert">
      {icons[type]}
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1 leading-snug">{title}</h4>}
        <p className="leading-relaxed">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close alert"
          className="text-slate-400 hover:text-slate-600 transition p-1"
        >
          &times;
        </button>
      )}
    </div>
  );
};
