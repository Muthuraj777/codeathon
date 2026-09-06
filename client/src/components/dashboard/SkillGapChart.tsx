import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AlertTriangle, Activity, BarChart2 } from 'lucide-react';

interface SkillGapChartProps {
  topSkillGaps: Array<{
    skillName: string;
    gapCount: number;
    percentage: number;
    category: string;
  }>;
}

export const SkillGapChart: React.FC<SkillGapChartProps> = ({ topSkillGaps }) => {
  return (
    <Card className="glass-bento overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-200/80">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2.5 text-[#0F172A] text-base font-semibold">
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span>Top Skill Deficiencies Matrix</span>
          </CardTitle>
          <CardDescription className="text-slate-500 text-xs font-normal">
            Organization-wide frequency breakdown of missing competencies across active candidate pools
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        {topSkillGaps.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
            <BarChart2 className="w-9 h-9 text-slate-300 mb-1" />
            <p className="font-medium text-slate-600">No skill gap deficiencies recorded yet.</p>
            <p className="text-slate-400 max-w-sm">Run a skill gap matrix calculation or configure target job role criteria.</p>
          </div>
        ) : (
          topSkillGaps.map((skill) => (
            <div key={skill.skillName} className="space-y-2 group p-2 rounded-xl hover:bg-slate-100/60 transition">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {skill.skillName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                    {skill.category}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-medium text-slate-500">{skill.gapCount} Candidates Gap</span>
                  <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-lg">
                    {skill.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress bar visualizer with Royal Blue gradient */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 rounded-full transition-all duration-1000 ease-out shadow-xs shadow-blue-500/30"
                  style={{ width: `${Math.min(100, Math.max(5, skill.percentage))}%` }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
