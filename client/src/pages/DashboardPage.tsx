import React, { useEffect } from 'react';
import { useDashboardStore } from '../stores/useDashboardStore';
import { SkillGapChart } from '../components/dashboard/SkillGapChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Users, Briefcase, FileCheck, Percent, ArrowRight, Target, Sparkles, TrendingUp, Compass, Award, ShieldCheck, Zap } from 'lucide-react';
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
      change: stats.employeesMeta || `${stats.totalEmployees} candidates & employees`,
      icon: Users,
      color: 'text-indigo-400',
      badge: 'Talent Pool',
      badgeVariant: 'primary' as const,
      gradient: 'from-indigo-500/10 via-indigo-600/5 to-transparent',
      borderColor: 'hover:border-indigo-500/40',
    },
    {
      title: 'Active Role Postings',
      value: stats.totalJobs.toString(),
      change: stats.jobsMeta || `${stats.totalJobs} benchmark postings`,
      icon: Briefcase,
      color: 'text-purple-400',
      badge: 'Open Roles',
      badgeVariant: 'purple' as const,
      gradient: 'from-purple-500/10 via-purple-600/5 to-transparent',
      borderColor: 'hover:border-purple-500/40',
    },
    {
      title: 'Submitted Applications',
      value: stats.totalApplications.toString(),
      change: stats.applicationsMeta || `${stats.totalApplications} in review pipeline`,
      icon: FileCheck,
      color: 'text-emerald-400',
      badge: 'Pipeline',
      badgeVariant: 'success' as const,
      gradient: 'from-emerald-500/10 via-emerald-600/5 to-transparent',
      borderColor: 'hover:border-emerald-500/40',
    },
    {
      title: 'Average Match Percent',
      value: `${stats.averageMatchPercent}%`,
      change: stats.matchMeta || 'Average proficiency match',
      icon: Percent,
      color: 'text-cyan-400',
      badge: 'Match Metric',
      badgeVariant: 'info' as const,
      gradient: 'from-cyan-500/10 via-cyan-600/5 to-transparent',
      borderColor: 'hover:border-cyan-500/40',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Executive Hero SaaS Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/90 to-purple-950/80 border border-slate-800/90 p-6 sm:p-10 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -top-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" dot className="px-3 py-1 font-semibold text-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Competency Intelligence Engine</span>
            </Badge>
            <Badge variant="neutral" className="text-[10px] font-mono-code">
              Updated Live
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Enterprise Talent <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">Skill Gap Analytics</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed font-light">
            Real-time organizational insights, candidate job readiness metrics, and automated AI skill gap frequency matrix across enterprise talent pools.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
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

      {/* KPI Metrics SaaS Grid */}
      {isLoading ? (
        <div className="py-16 flex justify-center">
          <Spinner size="lg" label="Syncing organizational KPI metrics..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((m) => (
            <Card
              key={m.title}
              className={`bg-slate-900/70 border-slate-800/80 backdrop-blur-xl ${m.borderColor} glass-card-hover group`}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{m.title}</span>
                  <Badge variant={m.badgeVariant} className="text-[10px]">
                    {m.badge}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="space-y-1">
                    <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono-code">
                      {m.value}
                    </h3>
                    <p className="text-[11px] font-medium text-emerald-400 flex items-center gap-1 font-mono-code">
                      <TrendingUp className="w-3 h-3 shrink-0" /> {m.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-2xl bg-slate-950 border border-slate-800 ${m.color} group-hover:scale-110 transition duration-200 shadow-md`}>
                    <m.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Analytics Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Skill Gaps Visualizer */}
        <div className="lg:col-span-2">
          <SkillGapChart topSkillGaps={stats.topSkillGaps} />
        </div>

        {/* Action Panel & Platform Shortcuts */}
        <div className="space-y-6">
          <Card className="bg-slate-900/70 backdrop-blur-xl border-slate-800/80 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-base font-bold">
                <Award className="w-5 h-5 text-indigo-400" />
                <span>Executive Control Panel</span>
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
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
                  <span className="text-[10px] font-mono-code text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    Edit
                  </span>
                </Button>
              </Link>

              <Link to="/applications" className="block w-full">
                <Button variant="secondary" className="w-full justify-between h-11">
                  <span className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" /> Review Submitted Applications
                  </span>
                  <Badge variant="success" className="font-mono-code">
                    {stats.totalApplications}
                  </Badge>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
