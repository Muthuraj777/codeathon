import React, { useEffect, useState } from 'react';
import { useSkillGapStore } from '../stores/useSkillGapStore';
import { MatchGauge } from '../components/skillGap/MatchGauge';
import { SkillGapTable } from '../components/skillGap/SkillGapTable';
import { RecommendationCard } from '../components/skillGap/RecommendationCard';
import { ApplyJobModal } from '../components/applications/ApplyJobModal';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { User, Briefcase, RefreshCw, Send, Download } from 'lucide-react';

export const SkillGapPage: React.FC = () => {
  const {
    students,
    jobs,
    selectedStudentId,
    selectedJobId,
    analysisResult,
    isLoading,
    error,
    setSelectedStudentId,
    setSelectedJobId,
    loadData,
    runAnalysis,
  } = useSkillGapStore();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading && !analysisResult) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spinner size="lg" label="Computing skill gap matrix and match score..." />
      </div>
    );
  }

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || {
    id: selectedJobId,
    title: analysisResult?.jobTitle || 'Java Full Stack Developer',
    company: 'ABC Technologies',
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" className="mb-1">
            Skill Gap Engine & Recommendations
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Competency Gap Analysis
          </h1>
          <p className="text-sm text-slate-500">
            Select a candidate profile and target job role to calculate real-time proficiency gaps
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={() => runAnalysis()} isLoading={isLoading}>
          <RefreshCw className="w-4 h-4 mr-1.5" /> Recalculate
        </Button>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Interactive Candidate & Job Selector Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
        {/* Student/Candidate Dropdown */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-4 h-4 text-indigo-600" />
            Select Employee / Student Candidate
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition cursor-pointer"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.roleTitle})
              </option>
            ))}
          </select>
        </div>

        {/* Job Dropdown */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            Select Target Job Profile
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition cursor-pointer"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} &mdash; {j.company}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Match Score Gauge */}
      {analysisResult && (
        <>
          <MatchGauge
            score={analysisResult.overallMatchScore}
            matchedCount={analysisResult.matchedCount}
            totalCount={analysisResult.totalSkillsCount}
          />

          {/* Skill Gap Comparison Table */}
          <SkillGapTable items={analysisResult.skillGaps} />

          {/* Prioritized Recommendations */}
          <RecommendationCard recommendations={analysisResult.recommendations} />

          {/* Application & Export Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <Button variant="outline" size="md">
              <Download className="w-4 h-4 mr-2" />
              Download Analysis Report (PDF)
            </Button>
            <Button variant="primary" size="md" onClick={() => setIsApplyModalOpen(true)}>
              <Send className="w-4 h-4 mr-2" />
              Submit Application ({analysisResult.overallMatchScore}% Match)
            </Button>
          </div>

          <ApplyJobModal
            isOpen={isApplyModalOpen}
            onClose={() => setIsApplyModalOpen(false)}
            job={selectedJob}
            matchPercent={analysisResult.overallMatchScore}
          />
        </>
      )}
    </div>
  );
};
