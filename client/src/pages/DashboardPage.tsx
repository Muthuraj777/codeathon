import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Users, Briefcase, FileCheck, Percent, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const metrics = [
    { title: 'Total Employees / Students', value: '250', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Total Jobs', value: '45', icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Applications', value: '120', icon: FileCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Average Skill Match', value: '74%', icon: Percent, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const topSkillGaps = [
    { name: 'Spring Boot', count: 85, percentage: 85, level: 'High Demand' },
    { name: 'React', count: 65, percentage: 65, level: 'Medium Demand' },
    { name: 'AWS', count: 48, percentage: 48, level: 'Medium Demand' },
    { name: 'Docker', count: 32, percentage: 32, level: 'Low Demand' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div className="max-w-3xl space-y-3">
          <Badge variant="primary" className="bg-indigo-500/20 text-indigo-200 border-indigo-400/30">
            System Dashboard
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Employee & Student Skill Gap Analyzer
          </h1>
          <p className="text-sm text-indigo-100/80 leading-relaxed">
            Real-time analytics and operational overview of competency match levels, skill deficiency patterns, and job alignment metrics.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
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

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Skill Gaps Visualizer */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Top Skill Gaps
              </CardTitle>
              <CardDescription>Most frequently missing competencies across all job profiles</CardDescription>
            </div>
            <Link to="/skill-gap">
              <span className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                Full Analysis <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {topSkillGaps.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">{skill.count} candidates missing</span>
                    <Badge variant={skill.percentage > 70 ? 'danger' : 'warning'} className="text-[10px]">
                      {skill.level}
                    </Badge>
                  </div>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full transition-all duration-500"
                    style={{ width: `${skill.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions & System Info */}
        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                Analyzer Engine
              </CardTitle>
              <CardDescription className="text-slate-400">
                Run immediate skill gap comparisons between candidates and targets.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/skill-gap" className="block w-full">
                <button className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow transition flex items-center justify-center gap-2">
                  Launch Gap Analyzer
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/profile" className="block w-full">
                <button className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-medium rounded-lg transition text-center">
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
