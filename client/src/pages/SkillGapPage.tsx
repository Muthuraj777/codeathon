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
import { User, Briefcase, RefreshCw, Send, Download, Sparkles, Target } from 'lucide-react';

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
        <Spinner size="lg" label="Calculating real-time competency gap matrix & match metrics..." />
      </div>
    );
  }

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || {
    id: selectedJobId,
    title: analysisResult?.jobTitle || 'Java Full Stack Developer',
    company: 'ABC Technologies',
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" dot className="px-3 py-1 font-medium text-xs mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Competency Gap Engine</span>
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Target className="w-7 h-7 text-indigo-400" />
            <span>Competency Gap Analysis</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Select a candidate profile and target job role to calculate real-time proficiency gaps and match metrics.
          </p>
        </div>

        <Button
          variant="outline"
          size="md"
          onClick={() => runAnalysis()}
          isLoading={isLoading}
          className="gap-2 shrink-0 border-zinc-800 bg-zinc-900/60"
        >
          <RefreshCw className="w-4 h-4 text-indigo-400" />
          <span>Recalculate Matrix</span>
        </Button>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Interactive Candidate & Job Selector Bento Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8 glass-bento rounded-3xl">
        {/* Student/Candidate Dropdown */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            Select Employee / Candidate Profile
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-4 py-3 glass-input rounded-2xl text-xs sm:text-sm font-medium text-zinc-100 focus:outline-none transition cursor-pointer"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id} className="bg-zinc-900 text-zinc-100">
                {s.name} ({s.roleTitle})
              </option>
            ))}
          </select>
        </div>

        {/* Job Dropdown */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-purple-400" />
            Select Target Job Benchmark
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full px-4 py-3 glass-input rounded-2xl text-xs sm:text-sm font-medium text-zinc-100 focus:outline-none transition cursor-pointer"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id} className="bg-zinc-900 text-zinc-100">
                {j.title} &mdash; {j.company}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Match Score Gauge & Matrix */}
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

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 p-6 glass-bento rounded-3xl">
            <Button variant="outline" size="md" className="w-full sm:w-auto gap-2 border-zinc-800">
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Download Gap Report (PDF)</span>
            </Button>
            <Button
              variant="glow"
              size="md"
              onClick={() => setIsApplyModalOpen(true)}
              className="w-full sm:w-auto gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Application ({analysisResult.overallMatchScore}% Match)</span>
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
