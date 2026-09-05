import React from 'react';
import type { SkillGapItem } from '../../types/skillGap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CheckCircle2, AlertTriangle, Target } from 'lucide-react';

interface SkillGapTableProps {
  items: SkillGapItem[];
}

export const SkillGapTable: React.FC<SkillGapTableProps> = ({ items }) => {
  return (
    <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800/80">
        <div>
          <CardTitle className="flex items-center gap-2 text-white text-lg font-bold">
            <Target className="w-5 h-5 text-indigo-400" />
            Competency Gap Analysis Matrix
          </CardTitle>
          <CardDescription className="text-slate-400 text-xs mt-0.5">
            Comparison of candidate's current ratings vs job required proficiency benchmarks
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider bg-slate-950/60">
                <th className="p-4 rounded-l-xl">Skill Name</th>
                <th className="p-4">Current Rating</th>
                <th className="p-4">Target Benchmark</th>
                <th className="p-4">Gap Score</th>
                <th className="p-4">Mandatory</th>
                <th className="p-4 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {items.map((item) => (
                <tr key={item.skillId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-slate-100">
                    {item.skillName}
                  </td>
                  <td className="p-4 font-semibold text-slate-300">
                    <span className="inline-flex items-center justify-center w-7 h-7 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs shadow-inner">
                      {item.currentLevel}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">/ 5</span>
                  </td>
                  <td className="p-4 font-semibold text-slate-300">
                    <span className="inline-flex items-center justify-center w-7 h-7 bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 rounded-lg font-mono text-xs shadow-inner">
                      {item.requiredLevel}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">/ 5</span>
                  </td>
                  <td className="p-4 font-mono font-bold">
                    {item.gap > 0 ? (
                      <span className="text-rose-300 bg-rose-950/60 border border-rose-800/80 px-2.5 py-1 rounded-lg text-xs font-mono">-{item.gap}</span>
                    ) : (
                      <span className="text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-lg text-xs font-mono">0</span>
                    )}
                  </td>
                  <td className="p-4">
                    {item.mandatory ? (
                      <Badge variant="danger" className="text-[10px]">
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] bg-slate-950 text-slate-400 border-slate-800">
                        No
                      </Badge>
                    )}
                  </td>
                  <td className="p-4">
                    {item.status === 'MATCHED' ? (
                      <Badge variant="success" className="flex items-center gap-1.5 w-max">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Matched
                      </Badge>
                    ) : (
                      <Badge variant="danger" className="flex items-center gap-1.5 w-max">
                        <AlertTriangle className="w-3.5 h-3.5" /> Gap (-{item.gap})
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

