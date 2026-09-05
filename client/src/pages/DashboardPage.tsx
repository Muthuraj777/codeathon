import React, { useEffect } from 'react';
import { useDashboardStore } from '../stores/useDashboardStore';
import { SkillGapChart } from '../components/dashboard/SkillGapChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Users,
  Briefcase,
  FileCheck,
  Percent,
  ArrowRight,
  Target,
  Sparkles,
  TrendingUp,
  Compass,
  Award,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { stats, isLoading, fetchStats } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const metrics = [
    {
      title: 'Total Talent Pool',
      value: stats.totalEmployees.toString(),
      change: stats.employeesMeta || `${stats.totalEmployees} active candidates`,
      icon: Users,
      color: 'text-indigo-400',
      badge: 'Talent Pool',
      badgeVariant: 'primary' as const,
    },
    {
      title: 'Active Job Roles',
      value: stats.totalJobs.toString(),
      change: stats.jobsMeta || `${stats.totalJobs} benchmark postings`,
      icon: Briefcase,
      color: 'text-purple-400',
      badge: 'Open Roles',
      badgeVariant: 'purple' as const,
    },
    {
      title: 'Applications',
      value: stats.totalApplications.toString(),
      change: stats.applicationsMeta || `${stats.totalApplications} in review`,
      icon: FileCheck,
      color: 'text-emerald-400',
      badge: 'Pipeline',
      badgeVariant: 'success' as const,
    },
    {
      title: 'Avg Match Score',
      value: `${stats.averageMatchPercent}%`,
      change: stats.matchMeta || 'Average readiness',
      icon: Percent,
      color: 'text-cyan-400',
      badge: 'Readiness',
      badgeVariant: 'info' as const,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Top Asymmetrical Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large Hero Bento Card (Span 8) */}
        <div className="lg:col-span-8">
          <div className="h-full relative overflow-hidden rounded-3xl glass-bento p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-blob-indigo pointer-events-none opacity-80" />
            <div className="absolute right-1/3 -top-10 w-80 h-80 bg-blob-purple pointer-events-none opacity-60" />

            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary" dot className="px-3 py-1 font-medium text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>AI Competency Intelligence Engine</span>
                </Badge>
                <Badge variant="neutral" className="text-[10px] font-mono">
                  Live Stream
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Enterprise Talent <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                  Skill Gap Analytics
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal max-w-xl">
                Real-time organizational insights, candidate job readiness metrics, and automated AI skill gap frequency matrix across enterprise talent pools.
              </p>
            </div>

            <div className="relative z-10 pt-2 flex flex-wrap items-center gap-3">
              <Link to="/skill-gap">
                <Button variant="glow" size="lg" className="gap-2">
                  <Target className="w-4 h-4" />
                  <span>Launch Skill Gap Engine</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" size="lg" className="gap-2">
                  <Compass className="w-4 h-4 text-purple-400" />
                  <span>Explore Role Benchmarks</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 4-Tile Mini Bento Stats Stack (Span 4) */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-4">
          {isLoading ? (
            <div className="col-span-2 py-12 flex justify-center">
              <Spinner size="md" label="Syncing stats..." />
            </div>
          ) : (
            metrics.map((m) => (
              <Card key={m.title} className="glass-bento group flex flex-col justify-between">
                <CardContent className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">{m.title}</span>
                    <div className={`p-2 rounded-xl bg-zinc-950 border border-zinc-800 ${m.color} group-hover:scale-105 transition shadow-sm`}>
                      <m.icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
                      {m.value}
                    </h3>
                    <p className="text-[10px] font-medium text-emerald-400 flex items-center gap-1 font-mono">
                      <TrendingUp className="w-2.5 h-2.5 shrink-0" /> {m.change}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

      </div>

      {/* Middle Asymmetrical Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Skill Deficiencies Visualizer (Span 7) */}
        <div className="lg:col-span-7">
          <SkillGapChart topSkillGaps={stats.topSkillGaps} />
        </div>

        {/* Executive Control & Actions Bento Card (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="glass-bento relative overflow-hidden h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-base font-semibold">
                <Award className="w-5 h-5 text-indigo-400" />
                <span>Executive Action Panel</span>
              </CardTitle>
              <CardDescription className="text-zinc-400 text-xs">
                Instant shortcuts to evaluate candidate readiness, update competency matrices, and review applications.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3.5">
              <Link to="/skill-gap" className="block w-full">
                <Button variant="primary" className="w-full justify-between h-11">
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-300" /> Run Skill Gap Matrix
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link to="/profile" className="block w-full">
                <Button variant="outline" className="w-full justify-between h-11">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" /> Update My Skill Matrix
                  </span>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    Edit
                  </span>
                </Button>
              </Link>

              <Link to="/applications" className="block w-full">
                <Button variant="secondary" className="w-full justify-between h-11">
                  <span className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" /> Review Submitted Applications
                  </span>
                  <Badge variant="success" className="font-mono">
                    {stats.totalApplications}
                  </Badge>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Full-Width Bento Grid: Real-time Talent Activity Stream */}
      <Card className="glass-bento">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-zinc-800/80">
          <div>
            <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-indigo-400" />
              <span>Real-Time Talent Activity Stream</span>
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400 mt-0.5">
              Live updates from candidate submissions and role competency evaluations
            </CardDescription>
          </div>
          <Badge variant="primary" dot className="text-[10px] font-mono">
            Live Timeline
          </Badge>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-zinc-100">Java Full Stack Developer</h4>
                  <span className="text-[10px] font-mono text-zinc-500">Just now</span>
                </div>
                <p className="text-[11px] text-zinc-400">Match score evaluation completed with 85% readiness.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-zinc-100">Cloud DevOps Benchmark</h4>
                  <span className="text-[10px] font-mono text-zinc-500">12m ago</span>
                </div>
                <p className="text-[11px] text-zinc-400">Updated required competency benchmarks for Kubernetes &amp; AWS.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-zinc-100">Candidate Application</h4>
                  <span className="text-[10px] font-mono text-zinc-500">1h ago</span>
                </div>
                <p className="text-[11px] text-zinc-400">New application submitted for ABC Technologies benchmark.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
