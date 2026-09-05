import React, { useEffect } from 'react';
import { useDashboardStore } from '../stores/useDashboardStore';
import { SkillGapChart } from '../components/dashboard/SkillGapChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { Users, Briefcase, FileCheck, Percent, ArrowRight, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { stats, isLoading, fetchStats } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const metrics = [
    {
      title: 'Total Employees / Students',
      value: stats.totalEmployees.toString(),
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Total Jobs',
      value: stats.totalJobs.toString(),
      icon: Briefcase,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Applications',
      value: stats.totalApplications.toString(),
      icon: FileCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Average Skill Match',
      value: `${stats.averageMatchPercent}%`,
      icon: Percent,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-3xl space-y-3">
          <Badge variant="primary" className="bg-indigo-500/20 text-indigo-200 border-indigo-400/30">
            Executive Analytics Dashboard
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Employee & Student Skill Gap Analyzer
          </h1>
          <p className="text-sm text-indigo-100/80 leading-relaxed">
            Real-time organizational insights, job readiness metrics, and top skill deficiency frequencies across candidate profiles.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      {isLoading ? (
        <Spinner size="lg" label="Loading dashboard KPI metrics..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((m) => (
            <Card key={m.title} className="hover:shadow-md transition">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{m.title}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{m.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${m.bg}`}>
                  <m.icon className={`w-6 h-6 ${m.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Skill Gaps Visualizer */}
        <div className="lg:col-span-2">
          <SkillGapChart topSkillGaps={stats.topSkillGaps} />
        </div>

        {/* Quick Launch & Quick Links */}
        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-slate-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                Skill Gap Engine
              </CardTitle>
              <CardDescription className="text-slate-400">
                Run immediate candidate match analysis against target job criteria.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/skill-gap" className="block w-full">
                <button className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer">
                  Launch Gap Analyzer
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/applications" className="block w-full">
                <button className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-medium rounded-xl transition text-center cursor-pointer">
                  View Job Applications
                </button>
              </Link>
              <Link to="/profile" className="block w-full">
                <button className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-medium rounded-xl transition text-center cursor-pointer">
                  Update My Profile Skills
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
