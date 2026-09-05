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
    <Card className="glass-bento shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-zinc-800/80">
        <div>
          <CardTitle className="flex items-center gap-2 text-white text-base font-semibold">
            <Target className="w-4.5 h-4.5 text-indigo-400" />
            Competency Gap Analysis Matrix
          </CardTitle>
          <CardDescription className="text-zinc-400 text-xs mt-0.5 font-normal">
            Detailed breakdown comparing candidate rating vs job benchmark proficiency requirements
          </CardDescription>
        </div>
        <Badge variant="neutral" className="font-mono text-[11px]">
          {items.length} Evaluated Skills
        </Badge>
      </CardHeader>

      <CardContent className="p-0 sm:p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/80 text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider bg-zinc-950/80">
                <th className="p-4 rounded-l-xl">Skill Name</th>
                <th className="p-4">Candidate Rating</th>
                <th className="p-4">Job Benchmark</th>
                <th className="p-4">Gap Score</th>
                <th className="p-4">Mandatory</th>
                <th className="p-4 rounded-r-xl">Competency Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-xs sm:text-sm">
              {items.map((item) => (
                <tr key={item.skillId} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="p-4 font-semibold text-zinc-100">{item.skillName}</td>
                  <td className="p-4 font-medium text-zinc-300">
                    <span className="inline-flex items-center justify-center w-7 h-7 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-mono text-xs shadow-inner">
                      {item.currentLevel}
                    </span>
                    <span className="text-xs text-zinc-500 ml-1">/ 5</span>
                  </td>
                  <td className="p-4 font-medium text-zinc-300">
                    <span className="inline-flex items-center justify-center w-7 h-7 bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 rounded-lg font-mono text-xs shadow-inner">
                      {item.requiredLevel}
                    </span>
                    <span className="text-xs text-zinc-500 ml-1">/ 5</span>
                  </td>
                  <td className="p-4 font-mono font-semibold">
                    {item.gap > 0 ? (
                      <span className="text-rose-300 bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded-lg text-xs">
                        -{item.gap}
                      </span>
                    ) : (
                      <span className="text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-lg text-xs">
                        0
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {item.mandatory ? (
                      <Badge variant="danger" dot className="text-[10px]">
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] bg-zinc-950 text-zinc-400 border-zinc-800">
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
