import React from 'react';
import type { RecommendationItem } from '../../types/skillGap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Zap, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';

interface RecommendationCardProps {
  recommendations: RecommendationItem[];
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendations }) => {
  const getPriorityBadgeVariant = (priority: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (priority) {
      case 'HIGH':
        return 'danger';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="glass-bento">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#0F172A] text-base font-semibold">
          <Zap className="w-4.5 h-4.5 text-amber-500" />
          <span>Prioritized Upskilling &amp; Training Roadmap</span>
        </CardTitle>
        <CardDescription className="text-slate-500 text-xs font-normal">
          Automated action plan items prioritized by mandatory status and proficiency gap magnitude
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 pt-2">
        {recommendations.length === 0 ? (
          <div className="p-8 text-center bg-emerald-50/50 rounded-2xl border border-emerald-200 text-slate-700 flex flex-col items-center justify-center space-y-2">
            <CheckCircle2 className="w-9 h-9 text-emerald-600 mb-1" />
            <p className="font-semibold text-base text-slate-900">Full Benchmark Qualification Achieved!</p>
            <p className="text-xs text-slate-500 max-w-sm">
              Candidate meets or exceeds all target proficiency benchmarks for this job profile.
            </p>
          </div>
        ) : (
          recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:border-blue-300"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant={getPriorityBadgeVariant(rec.priority)}  className="uppercase text-[10px] font-mono">
                    {rec.priority} Priority
                  </Badge>
                  <h4 className="font-semibold text-slate-900 text-sm">{rec.skillName}</h4>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 pt-0.5">
                  <span>Current: <strong className="text-slate-800 font-mono">{rec.currentLevel}</strong></span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                  <span>Target: <strong className="text-blue-700 font-mono">{rec.targetLevel}</strong></span>
                </div>

                <p className="text-xs text-slate-500 italic">Reason: {rec.reason}</p>
              </div>

              <Button variant="outline" size="sm" className="shrink-0 cursor-pointer gap-1.5 border-slate-200 bg-white text-blue-700 hover:bg-slate-50">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>Learning Module</span>
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
