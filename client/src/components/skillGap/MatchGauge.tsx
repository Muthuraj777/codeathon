import React from 'react';
import { Sparkles, CheckCircle2, Target } from 'lucide-react';
import { Badge } from '../ui/Badge';


interface MatchGaugeProps {
  score: number; // 0 to 100
  matchedCount: number;
  totalCount: number;
}

export const MatchGauge: React.FC<MatchGaugeProps> = ({ score, matchedCount, totalCount }) => {
  const strokeDashoffset = 283 - (283 * score) / 100;

  const getScoreColor = () => {
    if (score >= 80) return { text: 'text-emerald-400', ring: 'stroke-emerald-500', bg: 'bg-emerald-500/10', label: 'High Competency Match' };
    if (score >= 60) return { text: 'text-indigo-400', ring: 'stroke-indigo-500', bg: 'bg-indigo-500/10', label: 'Good Proficiency Match' };
    if (score >= 40) return { text: 'text-amber-400', ring: 'stroke-amber-500', bg: 'bg-amber-500/10', label: 'Moderate Skill Deficit' };
    return { text: 'text-rose-400', ring: 'stroke-rose-500', bg: 'bg-rose-500/10', label: 'Significant Competency Gap' };
  };

  const statusInfo = getScoreColor();

  return (
    <div className="h-full flex flex-col justify-between p-6 sm:p-7 glass-bento rounded-3xl text-white relative overflow-hidden space-y-6">
      <div className="absolute top-0 right-0 w-48 h-48 bg-blob-indigo pointer-events-none opacity-80" />

      <div className="flex items-center justify-between relative z-10">
        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-indigo-400" /> Overall Job Readiness Rating
        </span>
        <Badge variant="primary" dot className="text-[10px] font-mono">
          AI Evaluated
        </Badge>
      </div>

      {/* SVG Ring Gauge */}
      <div className="flex flex-col items-center justify-center py-2 relative z-10">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              className="stroke-zinc-950"
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
            <span className={`text-3xl font-extrabold ${statusInfo.text} font-mono`}>{score}%</span>
            <span className="text-[9px] uppercase font-semibold text-zinc-400 tracking-wider">Score</span>
          </div>
        </div>

        <div className="text-center mt-3 space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">{statusInfo.label}</h3>
          <p className="text-xs text-zinc-400">
            Satisfies <strong className="text-indigo-300 font-mono">{matchedCount}</strong> of{' '}
            <strong className="text-zinc-100 font-mono">{totalCount}</strong> required skills
          </p>
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-zinc-800/80 text-xs text-zinc-400 relative z-10">
        <div className="flex items-center justify-between bg-zinc-950/80 px-3 py-2 rounded-xl border border-zinc-800">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Mandatory Weight
          </span>
          <strong className="text-zinc-200 font-mono">2.0x</strong>
        </div>
        <div className="flex items-center justify-between bg-zinc-950/80 px-3 py-2 rounded-xl border border-zinc-800">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Optional Weight
          </span>
          <strong className="text-zinc-200 font-mono">1.0x</strong>
        </div>
      </div>
    </div>
  );
};
