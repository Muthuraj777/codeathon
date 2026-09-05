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
import { User, Briefcase, RefreshCw, Send, Download, Sparkles } from 'lucide-react';

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
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Competency Gap Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Competency Gap Analysis
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Select a candidate profile and target job role to calculate real-time proficiency gaps and match metrics.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={() => runAnalysis()} isLoading={isLoading} className="border-slate-800 bg-slate-900/60 text-slate-200 hover:bg-slate-800">
          <RefreshCw className="w-4 h-4 mr-1.5 text-indigo-400" /> Recalculate Matrix
        </Button>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Interactive Candidate & Job Selector Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 bg-slate-900/60 rounded-3xl border border-slate-800/80 backdrop-blur-xl shadow-2xl">
        {/* Student/Candidate Dropdown */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            Select Employee / Student Candidate
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-sm font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition cursor-pointer"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-slate-100">
                {s.name} ({s.roleTitle})
              </option>
            ))}
          </select>
        </div>

        {/* Job Dropdown */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            Select Target Job Profile Benchmark
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-sm font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition cursor-pointer"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id} className="bg-slate-900 text-slate-100">
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
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-5 bg-slate-900/60 rounded-3xl border border-slate-800/80 backdrop-blur-xl shadow-xl">
            <Button variant="outline" size="md" className="border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800">
              <Download className="w-4 h-4 mr-2 text-indigo-400" />
              Download Gap Report (PDF)
            </Button>
            <Button variant="primary" size="md" onClick={() => setIsApplyModalOpen(true)} className="shadow-lg shadow-indigo-600/30">
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

