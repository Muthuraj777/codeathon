import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Target, CheckCircle2, AlertTriangle, Zap, Sparkles, Send } from 'lucide-react';
import { useAuthStore } from '../stores/useAuthStore';

interface GapItem {
  skill: string;
  current: number;
  required: number;
  gap: number;
  mandatory: boolean;
  status: 'Matched' | 'Gap';
}

interface RecommendationItem {
  id: string;
  priority: 'High' | 'Medium' | 'Low';
  skill: string;
  current: number;
  target: number;
  reason: string;
}

export const SkillGapPage: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedJob] = useState('Java Full Stack Developer');
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const gapAnalysis: GapItem[] = [
    { skill: 'Java', current: 4, required: 4, gap: 0, mandatory: true, status: 'Matched' },
    { skill: 'MySQL', current: 4, required: 3, gap: 0, mandatory: true, status: 'Matched' },
    { skill: 'Spring Boot', current: 2, required: 4, gap: 2, mandatory: true, status: 'Gap' },
    { skill: 'React', current: 2, required: 3, gap: 1, mandatory: true, status: 'Gap' },
    { skill: 'AWS', current: 1, required: 2, gap: 1, mandatory: false, status: 'Gap' },
  ];

  const recommendations: RecommendationItem[] = [
    {
      id: 'rec-1',
      priority: 'High',
      skill: 'Spring Boot',
      current: 2,
      target: 4,
      reason: 'Mandatory job requirement & primary framework deficit',
    },
    {
      id: 'rec-2',
      priority: 'Medium',
      skill: 'React',
      current: 2,
      target: 3,
      reason: 'Required proficiency gap for frontend integration',
    },
    {
      id: 'rec-3',
      priority: 'Medium',
      skill: 'AWS',
      current: 1,
      target: 2,
      reason: 'Required supporting cloud deployment skill',
    },
  ];

  const matchPercentage = 72;

  const handleApply = () => {
    setApplicationSubmitted(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge variant="primary" className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
              Analysis Report
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Skill Gap Analyzer</h1>
            <p className="text-sm text-slate-300">
              Candidate: <strong className="text-white">{user?.name || 'Arun'}</strong> &bull; Target Job:{' '}
              <strong className="text-indigo-400">{selectedJob}</strong>
            </p>
          </div>

          {/* Overall Match Circle / Score */}
          <div className="p-5 bg-slate-800/90 rounded-2xl border border-slate-700 flex items-center gap-4 shrink-0">
            <div className="relative w-16 h-16 rounded-full bg-indigo-600/20 border-4 border-indigo-500 flex items-center justify-center">
              <span className="text-xl font-black text-indigo-400">{matchPercentage}%</span>
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-slate-400">Overall Match</p>
              <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                <Sparkles className="w-4 h-4" /> Good Compatibility
              </p>
            </div>
          </div>
        </div>
      </div>

      {applicationSubmitted && (
        <Alert
          type="success"
          title="Application Submitted Successfully!"
          message="Your application and skill match score have been routed to the hiring manager for review."
          onClose={() => setApplicationSubmitted(false)}
        />
      )}

      {/* Gap Analysis Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Target className="w-5 h-5 text-indigo-600" />
              Competency Gap Analysis
            </CardTitle>
            <CardDescription>Direct comparison of current skill ratings vs job requirements</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                  <th className="p-3.5 rounded-l-lg">Skill</th>
                  <th className="p-3.5">Current Level</th>
                  <th className="p-3.5">Required Level</th>
                  <th className="p-3.5">Gap Score</th>
                  <th className="p-3.5 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {gapAnalysis.map((item) => (
                  <tr key={item.skill} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                      {item.skill}
                      {item.mandatory && (
                        <Badge variant="outline" className="text-[10px] py-0 border-amber-300 text-amber-700 bg-amber-50">
                          Mandatory
                        </Badge>
                      )}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-700">{item.current} / 5</td>
                    <td className="p-3.5 font-semibold text-slate-700">{item.required} / 5</td>
                    <td className="p-3.5 font-mono font-bold">
                      {item.gap > 0 ? (
                        <span className="text-red-600">-{item.gap}</span>
                      ) : (
                        <span className="text-emerald-600">0</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      {item.status === 'Matched' ? (
                        <Badge variant="success" className="flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Matched
                        </Badge>
                      ) : (
                        <Badge variant="danger" className="flex items-center gap-1 w-max">
                          <AlertTriangle className="w-3.5 h-3.5" /> Gap: {item.gap}
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

      {/* AI Recommendations */}
      <Card className="border-indigo-100 bg-indigo-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Zap className="w-5 h-5 text-amber-500" />
            Prioritized Learning Recommendations
          </CardTitle>
          <CardDescription>Targeted learning paths to resolve identified skill deficits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={rec.priority === 'High' ? 'danger' : 'warning'} className="uppercase text-[10px]">
                    {rec.priority} Priority
                  </Badge>
                  <h4 className="font-bold text-slate-900">{rec.skill}</h4>
                </div>
                <p className="text-xs text-slate-600">
                  Target Proficiency: Level <strong className="text-slate-900">{rec.current}</strong> &rarr; Level{' '}
                  <strong className="text-indigo-600">{rec.target}</strong>
                </p>
                <p className="text-xs text-slate-500 italic">Reason: {rec.reason}</p>
              </div>

              <Button variant="outline" size="sm" className="shrink-0">
                Explore Courses
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <Button variant="primary" size="lg" onClick={handleApply} className="w-full sm:w-auto">
          <Send className="w-4 h-4 mr-2" />
          Submit Job Application ({matchPercentage}% Match)
        </Button>
      </div>
    </div>
  );
};
