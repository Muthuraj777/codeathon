import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AlertTriangle, Activity } from 'lucide-react';

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
    <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800/60">
        <div>
          <CardTitle className="flex items-center gap-2.5 text-white text-base">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            Top Skill Gap Deficiencies
          </CardTitle>
          <CardDescription className="text-slate-400 text-xs mt-1">
            Organization-wide frequency analysis of missing competencies across the candidate pool
          </CardDescription>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono bg-slate-900/90 text-indigo-400 border-indigo-500/30 flex items-center gap-1">
          <Activity className="w-3 h-3" /> Real-time Frequency
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {topSkillGaps.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">
            No skill gap deficiencies recorded yet. Run a skill gap analysis or add job requirements to populate metrics.
          </div>
        ) : (
          topSkillGaps.map((skill) => (
            <div key={skill.skillName} className="space-y-2.5 group">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {skill.skillName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60">
                    {skill.category}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-medium text-slate-400">{skill.gapCount} Candidates Missing</span>
                  <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded-md shadow-xs">
                    {skill.percentage}%
                  </span>
                </div>
              </div>

              {/* Glowing Gradient Bar Visualizer */}
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800/80">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out shadow-sm shadow-indigo-500/50"
                  style={{ width: `${skill.percentage}%` }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

