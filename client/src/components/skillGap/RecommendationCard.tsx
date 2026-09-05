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
    <Card className="border-indigo-500/30 bg-gradient-to-b from-indigo-950/20 to-slate-900/70 backdrop-blur-xl shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white text-lg font-bold">
          <Zap className="w-5 h-5 text-amber-400" />
          <span>Prioritized Upskilling &amp; Training Roadmap</span>
        </CardTitle>
        <CardDescription className="text-slate-400 text-xs">
          Automated action plan items prioritized by mandatory status and proficiency gap magnitude
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 text-slate-300 flex flex-col items-center justify-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-1" />
            <p className="font-bold text-base text-white">Full Benchmark Qualification Achieved!</p>
            <p className="text-xs text-slate-400 max-w-sm">
              Candidate meets or exceeds all target proficiency benchmarks for this job profile.
            </p>
          </div>
        ) : (
          recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-indigo-500/50"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5">
                  <Badge variant={getPriorityBadgeVariant(rec.priority)} dot className="uppercase text-[10px] font-mono-code">
                    {rec.priority} Priority
                  </Badge>
                  <h4 className="font-bold text-slate-100 text-base">{rec.skillName}</h4>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-slate-400 pt-0.5">
                  <span>Current Rating: <strong className="text-slate-200 font-mono-code">{rec.currentLevel}</strong></span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Target Benchmark: <strong className="text-indigo-300 font-mono-code">{rec.targetLevel}</strong></span>
                </div>

                <p className="text-xs text-slate-400 italic font-normal">Reason: {rec.reason}</p>
              </div>

              <Button variant="outline" size="sm" className="shrink-0 cursor-pointer gap-1.5 border-slate-700 bg-slate-900 text-indigo-300 hover:bg-slate-800">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>View Learning Module</span>
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
