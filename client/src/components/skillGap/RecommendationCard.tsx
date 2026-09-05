import React from 'react';
import type { RecommendationItem } from '../../types/skillGap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Zap, ArrowRight, BookOpen } from 'lucide-react';

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
    <Card className="border-indigo-100 bg-indigo-50/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Zap className="w-5 h-5 text-amber-500" />
          Prioritized Learning Recommendations
        </CardTitle>
        <CardDescription>
          Automated action items prioritized by mandatory status and gap size
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500">
            🎉 No skill gaps detected! Candidate meets all required proficiency levels for this job.
          </div>
        ) : (
          recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:border-indigo-200"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant={getPriorityBadgeVariant(rec.priority)} className="uppercase text-[10px] tracking-wider">
                    {rec.priority} Priority
                  </Badge>
                  <h4 className="font-bold text-slate-900 text-base">{rec.skillName}</h4>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span>Current Level: <strong className="text-slate-800">{rec.currentLevel}</strong></span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Target Level: <strong className="text-indigo-600">{rec.targetLevel}</strong></span>
                </div>

                <p className="text-xs text-slate-500 italic">Reason: {rec.reason}</p>
              </div>

              <Button variant="outline" size="sm" className="shrink-0 cursor-pointer">
                <BookOpen className="w-4 h-4 mr-1.5 text-indigo-600" />
                View Learning Course
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
