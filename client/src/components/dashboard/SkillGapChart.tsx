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
    <Card className="bg-slate-900/70 backdrop-blur-xl border-slate-800/80 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2.5 text-white text-base font-bold">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span>Top Skill Deficiencies Matrix</span>
          </CardTitle>
          <CardDescription className="text-slate-400 text-xs font-normal">
            Organization-wide frequency breakdown of missing competencies across active candidate pools
          </CardDescription>
        </div>
        <Badge variant="purple" dot className="text-[10px] font-mono-code hidden sm:flex">
          <Activity className="w-3 h-3 text-purple-400 mr-1" /> Live Frequency
        </Badge>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        {topSkillGaps.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs flex flex-col items-center justify-center space-y-2">
            <BarChart2 className="w-10 h-10 text-slate-700 mb-1" />
            <p className="font-semibold text-slate-400">No skill gap deficiencies recorded yet.</p>
            <p className="text-slate-500 max-w-sm">Run a skill gap matrix calculation or configure target job role criteria.</p>
          </div>
        ) : (
          topSkillGaps.map((skill) => (
            <div key={skill.skillName} className="space-y-2 group">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {skill.skillName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono-code px-2 py-0.5 rounded-full bg-slate-950/80 border border-slate-800">
                    {skill.category}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-medium text-slate-400">{skill.gapCount} Candidates Gap</span>
                  <span className="font-mono-code text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded-lg shadow-xs">
                    {skill.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress bar visualizer with glowing gradient */}
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800/80">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out shadow-sm shadow-indigo-500/50"
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
