import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { AlertCircle } from 'lucide-react';

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
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Top Skill Gap Deficiencies
          </CardTitle>
          <CardDescription>
            Organization-wide frequency analysis of missing competencies across candidate pool
          </CardDescription>
        </div>
        <Badge variant="outline" className="text-xs">
          Frequency Chart
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {topSkillGaps.map((skill) => (
          <div key={skill.skillName} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="font-bold text-slate-900">{skill.skillName}</span>
                <span className="text-xs text-slate-500 ml-2 font-normal">({skill.category})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">{skill.gapCount} Candidates Missing</span>
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {skill.percentage}%
                </span>
              </div>
            </div>

            {/* Custom Bar Visualizer */}
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-slate-900 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${skill.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
