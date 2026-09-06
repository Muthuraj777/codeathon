import React, { useEffect, useState } from 'react';
import { useSkillGapStore } from '../stores/useSkillGapStore';
import { MatchGauge } from '../components/skillGap/MatchGauge';
import { SkillGapTable } from '../components/skillGap/SkillGapTable';
import { RecommendationCard } from '../components/skillGap/RecommendationCard';
import { ApplyJobModal } from '../components/applications/ApplyJobModal';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-3">
            <Target className="w-7 h-7 text-[#2563EB]" />
            <span>Competency Gap Analysis</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Select a candidate profile and target job role to calculate real-time proficiency gaps and match metrics.
          </p>
        </div>

        <Button
          variant="outline"
          size="md"
          onClick={() => runAnalysis()}
          isLoading={isLoading}
          className="gap-2 shrink-0 border-slate-200 bg-white"
        >
          <RefreshCw className="w-4 h-4 text-blue-600" />
          <span>Recalculate Matrix</span>
        </Button>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Candidate & Job Selector Bento Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-7 glass-bento rounded-3xl">
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            Select Employee / Candidate Profile
          </label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-4 py-3 glass-input rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none transition cursor-pointer"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id} className="bg-white text-slate-900">
                {s.name} ({s.roleTitle})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-purple-600" />
            Select Target Job Benchmark
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full px-4 py-3 glass-input rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none transition cursor-pointer"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id} className="bg-white text-slate-900">
                {j.title} &mdash; {j.company}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Asymmetrical Bento Grid Results View */}
      {analysisResult && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* SVG Ring Match Gauge Bento Card (Span 4) */}
            <div className="lg:col-span-4">
              <MatchGauge
                score={analysisResult.overallMatchScore}
                matchedCount={analysisResult.matchedCount}
                totalCount={analysisResult.totalSkillsCount}
              />
            </div>

            {/* Competency Gap Comparison Table Bento Card (Span 8) */}
            <div className="lg:col-span-8">
              <SkillGapTable items={analysisResult.skillGaps} />
            </div>
          </div>

          {/* Upskilling Roadmap Bento Card (Full Width) */}
          <RecommendationCard recommendations={analysisResult.recommendations} />

          {/* Bottom Action Bar Bento Card */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 glass-bento rounded-3xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-900">Assessment Ready</h4>
                <p className="text-[11px] text-slate-500">Calculated overall candidate match score of {analysisResult.overallMatchScore}%.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full sm:w-auto gap-2 border-slate-200 bg-white">
                <Download className="w-4 h-4 text-blue-600" />
                <span>Export PDF</span>
              </Button>
              <Button
                variant="glow"
                size="md"
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full sm:w-auto gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Application ({analysisResult.overallMatchScore}%)</span>
              </Button>
            </div>
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
