import React from 'react';
import { Sparkles, CheckCircle2, Target } from 'lucide-react';

interface MatchGaugeProps {
  score: number; // 0 to 100
  matchedCount: number;
  totalCount: number;
}

export const MatchGauge: React.FC<MatchGaugeProps> = ({ score, matchedCount, totalCount }) => {
  const strokeDashoffset = 283 - (283 * score) / 100;

  const getScoreColor = () => {
    if (score >= 80) return { text: 'text-emerald-400', ring: 'stroke-emerald-500', label: 'High Competency Match' };
    if (score >= 60) return { text: 'text-indigo-400', ring: 'stroke-indigo-500', label: 'Good Proficiency Match' };
    if (score >= 40) return { text: 'text-amber-400', ring: 'stroke-amber-500', label: 'Moderate Skill Deficit' };
    return { text: 'text-rose-400', ring: 'stroke-rose-500', label: 'Significant Competency Gap' };
  };

  const statusInfo = getScoreColor();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 bg-slate-900/70 text-white rounded-3xl border border-slate-800/80 backdrop-blur-xl shadow-2xl gap-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-6 relative z-10">
        {/* SVG Circular Ring Gauge */}
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              className="stroke-slate-950"
              strokeWidth="9"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              className={`${statusInfo.ring} transition-all duration-1000 ease-out`}
              strokeWidth="9"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`text-2xl sm:text-3xl font-black ${statusInfo.text} font-mono-code`}>{score}%</span>
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Match</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-indigo-400" /> Overall Job Readiness Rating
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {statusInfo.label}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Candidate satisfies <strong className="text-indigo-300 font-mono-code">{matchedCount}</strong> of{' '}
            <strong className="text-slate-100 font-mono-code">{totalCount}</strong> required skill benchmarks
          </p>
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-800 text-xs text-slate-400 gap-2.5 relative z-10">
        <div className="flex items-center gap-2 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Mandatory Weight: <strong className="text-slate-200 font-mono-code">2.0x</strong></span>
        </div>
        <div className="flex items-center gap-2 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Optional Weight: <strong className="text-slate-200 font-mono-code">1.0x</strong></span>
        </div>
      </div>
    </div>
  );
};
