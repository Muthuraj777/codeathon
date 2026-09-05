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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Target className="w-5 h-5 text-indigo-600" />
            Competency Gap Analysis Matrix
          </CardTitle>
          <CardDescription>
            Comparison of candidate's current ratings vs job required proficiency levels
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                <th className="p-3.5 rounded-l-lg">Skill Name</th>
                <th className="p-3.5">Current Level</th>
                <th className="p-3.5">Required Level</th>
                <th className="p-3.5">Gap Score</th>
                <th className="p-3.5">Mandatory</th>
                <th className="p-3.5 rounded-r-lg">Match Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {items.map((item) => (
                <tr key={item.skillId} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 font-bold text-slate-900">
                    {item.skillName}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-700">
                    <span className="inline-flex items-center justify-center w-7 h-7 bg-slate-100 rounded-lg text-slate-800 font-mono text-xs">
                      {item.currentLevel}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">/ 5</span>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-700">
                    <span className="inline-flex items-center justify-center w-7 h-7 bg-indigo-50 text-indigo-700 rounded-lg font-mono text-xs">
                      {item.requiredLevel}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">/ 5</span>
                  </td>
                  <td className="p-3.5 font-mono font-bold">
                    {item.gap > 0 ? (
                      <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs">-{item.gap}</span>
                    ) : (
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">0</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    {item.mandatory ? (
                      <Badge variant="danger" className="text-[10px]">
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        No
                      </Badge>
                    )}
                  </td>
                  <td className="p-3.5">
                    {item.status === 'MATCHED' ? (
                      <Badge variant="success" className="flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Matched
                      </Badge>
                    ) : (
                      <Badge variant="danger" className="flex items-center gap-1 w-max">
                        <AlertTriangle className="w-3.5 h-3.5" /> Gap ({item.gap})
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
