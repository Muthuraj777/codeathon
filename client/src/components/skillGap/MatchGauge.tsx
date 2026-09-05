import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface MatchGaugeProps {
  score: number; // 0 to 100
  matchedCount: number;
  totalCount: number;
}

export const MatchGauge: React.FC<MatchGaugeProps> = ({ score, matchedCount, totalCount }) => {
  const strokeDashoffset = 283 - (283 * score) / 100;

  const getScoreColor = () => {
    if (score >= 80) return { text: 'text-emerald-400', ring: 'stroke-emerald-500', label: 'Excellent Match' };
    if (score >= 60) return { text: 'text-indigo-400', ring: 'stroke-indigo-500', label: 'Good Match' };
    if (score >= 40) return { text: 'text-amber-400', ring: 'stroke-amber-500', label: 'Moderate Deficit' };
    return { text: 'text-rose-400', ring: 'stroke-rose-500', label: 'Significant Gap' };
  };

  const statusInfo = getScoreColor();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl gap-6">
      <div className="flex items-center gap-6">
        {/* SVG Circular Ring Gauge */}
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              className="stroke-slate-800"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              className={`${statusInfo.ring} transition-all duration-1000 ease-out`}
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`text-2xl font-black ${statusInfo.text}`}>{score}%</span>
            <span className="text-[9px] uppercase font-bold text-slate-400">Match</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overall Match Percentage</span>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            {statusInfo.label}
          </h3>
          <p className="text-xs text-slate-400">
            <span className="font-semibold text-indigo-300">{matchedCount}</span> of{' '}
            <span className="font-semibold text-slate-200">{totalCount}</span> required skills matched
          </p>
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-800 text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Mandatory Weight: <strong>2x</strong></span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Optional Weight: <strong>1x</strong></span>
        </div>
      </div>
    </div>
  );
};
