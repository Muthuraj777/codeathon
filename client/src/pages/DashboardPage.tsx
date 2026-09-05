import React, { useEffect } from 'react';
import { useDashboardStore } from '../stores/useDashboardStore';
import { SkillGapChart } from '../components/dashboard/SkillGapChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { Users, Briefcase, FileCheck, Percent, ArrowRight, Target, Sparkles, TrendingUp, Compass, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { stats, isLoading, fetchStats } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const metrics = [
    {
      title: 'Total Candidates & Employees',
      value: stats.totalEmployees.toString(),
      change: stats.employeesMeta || `${stats.totalEmployees} registered candidates`,
      icon: Users,
      color: 'text-indigo-400',
      glow: 'shadow-indigo-500/10 border-indigo-500/20',
      gradient: 'from-indigo-500/10 to-indigo-600/5',
    },
    {
      title: 'Active Job Openings',
      value: stats.totalJobs.toString(),
      change: stats.jobsMeta || `${stats.totalJobs} active job posts`,
      icon: Briefcase,
      color: 'text-purple-400',
      glow: 'shadow-purple-500/10 border-purple-500/20',
      gradient: 'from-purple-500/10 to-purple-600/5',
    },
    {
      title: 'Submitted Applications',
      value: stats.totalApplications.toString(),
      change: stats.applicationsMeta || `${stats.totalApplications} submitted`,
      icon: FileCheck,
      color: 'text-emerald-400',
      glow: 'shadow-emerald-500/10 border-emerald-500/20',
      gradient: 'from-emerald-500/10 to-emerald-600/5',
    },
    {
      title: 'Average Skill Match',
      value: `${stats.averageMatchPercent}%`,
      change: stats.matchMeta || 'Avg match percentage',
      icon: Percent,
      color: 'text-cyan-400',
      glow: 'shadow-cyan-500/10 border-cyan-500/20',
      gradient: 'from-cyan-500/10 to-cyan-600/5',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Executive Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/90 to-purple-950/80 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -top-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Executive Competency Intelligence
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Employee &amp; Candidate <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">Skill Gap Analytics</span>
          </h1>
          <p className="text-sm text-slate-300/90 leading-relaxed font-light">
            Real-time organizational insights, job readiness metrics, and automated AI skill gap frequency analysis across talent pools.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link to="/skill-gap">
              <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 border border-indigo-400/30 transition-all cursor-pointer flex items-center gap-2">
                <Target className="w-4 h-4" />
                Launch Skill Gap Engine
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
            <Link to="/jobs">
              <button className="px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold backdrop-blur-xs transition cursor-pointer flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-400" />
                Explore Target Job Criteria
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      {isLoading ? (
        <div className="py-12 flex justify-center">
          <Spinner size="lg" label="Loading real-time organizational KPI metrics..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((m) => (
            <Card key={m.title} className={`bg-slate-900/70 border-slate-800/80 backdrop-blur-xl ${m.glow} glass-card-hover`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{m.title}</span>
                  <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 ${m.color}`}>
                    <m.icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <h3 className="text-3xl font-extrabold text-white tracking-tight font-mono">{m.value}</h3>
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                    <TrendingUp className="w-3 h-3" /> {m.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Analytics Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Skill Gaps Chart Visualizer */}
        <div className="lg:col-span-2">
          <SkillGapChart topSkillGaps={stats.topSkillGaps} />
        </div>

        {/* Action Panel & Platform Shortcuts */}
        <div className="space-y-6">
          <Card className="bg-slate-900/70 backdrop-blur-xl border-slate-800/80 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-base font-bold">
                <Award className="w-5 h-5 text-indigo-400" />
                Quick Operations
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Direct actions to manage employee competencies, review jobs, and evaluate readiness.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/skill-gap" className="block w-full">
                <button className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/20 border border-indigo-400/30 transition flex items-center justify-between cursor-pointer">
                  <span>Run Skill Gap Matrix</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/profile" className="block w-full">
                <button className="w-full py-2.5 px-4 bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold rounded-xl transition text-left cursor-pointer flex items-center justify-between">
                  <span>Update Profile Skill Matrix</span>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">Edit</span>
                </button>
              </Link>
              <Link to="/applications" className="block w-full">
                <button className="w-full py-2.5 px-4 bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold rounded-xl transition text-left cursor-pointer flex items-center justify-between">
                  <span>Review Submitted Applications</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {stats.totalApplications}
                  </span>
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

