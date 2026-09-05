import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useApplicationStore } from '../stores/useApplicationStore';
import type { ApplicationStatus } from '../types/application';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import { Spinner } from '../components/ui/Spinner';
import { FileCheck, Building2, User, Clock, Sparkles } from 'lucide-react';

export const ApplicationsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { applications, isLoading, error, successMessage, fetchApplications, updateApplicationStatus, clearMessages } =
    useApplicationStore();

  const [filterStatus, setFilterStatus] = useState<string>('All');

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const isAdmin = user?.role === 'admin';

  const userApplications = isAdmin
    ? applications
    : applications.filter(
        (a) => a.studentId === user?.id || a.studentEmail.toLowerCase() === user?.email.toLowerCase() || a.studentName === user?.name
      );

  const filteredApplications =
    filterStatus === 'All' ? userApplications : userApplications.filter((a) => a.status === filterStatus);

  const getStatusBadgeVariant = (status: ApplicationStatus) => {
    switch (status) {
      case 'Accepted':
        return 'success';
      case 'Interviewing':
        return 'primary';
      case 'Under Review':
        return 'warning';
      case 'Submitted':
        return 'secondary';
      case 'Rejected':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    await updateApplicationStatus(appId, newStatus);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recruitment & Application Pipeline</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {isAdmin ? 'Recruiter Application Review Board' : 'My Job Applications'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isAdmin
              ? 'Review candidate submissions, skill match scores, and manage application progression'
              : 'Track submitted job applications and real-time status updates'}
          </p>
        </div>
      </div>

      {successMessage && <Alert type="success" message={successMessage} onClose={clearMessages} />}
      {error && <Alert type="error" message={error} onClose={clearMessages} />}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-4">
        {['All', 'Submitted', 'Under Review', 'Interviewing', 'Accepted', 'Rejected'].map((st) => {
          const isSelected = filterStatus === st;
          return (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                  : 'bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {st}
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="py-24 text-center">
          <Spinner size="lg" label="Loading application records..." />
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card className="p-16 text-center text-slate-500 border-slate-800/80 bg-slate-900/40 backdrop-blur-xl">
          <FileCheck className="w-12 h-12 mx-auto text-slate-700 mb-3" />
          <h3 className="text-lg font-bold text-slate-200 mb-1">No Applications Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {isAdmin
              ? 'No candidate applications match the selected filter stage.'
              : "You haven't submitted any job applications yet. Go to Job Profiles or Skill Gap Analyzer to apply!"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApplications.map((app) => (
            <Card key={app.id} className="border-slate-800/80 bg-slate-900/60 backdrop-blur-xl hover:border-slate-700 transition shadow-xl">
              <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusBadgeVariant(app.status)} className="capitalize text-xs font-mono">
                      {app.status}
                    </Badge>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{app.jobTitle}</h3>
                    <p className="text-xs font-semibold text-indigo-400 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      {app.companyName}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <User className="w-4 h-4 text-slate-500" />
                      Candidate: <strong className="text-slate-200 ml-1">{app.studentName}</strong> ({app.studentEmail})
                    </span>
                  </div>
                </div>

                {/* Score & Action Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-center sm:text-right">
                    <p className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Match Score</p>
                    <p className="text-3xl font-black text-indigo-400 font-mono">{app.matchPercent}%</p>
                  </div>

                  {isAdmin && (
                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Update Status</label>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                        className="px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                      >
                        <option value="Submitted" className="bg-slate-900 text-slate-100">Submitted</option>
                        <option value="Under Review" className="bg-slate-900 text-slate-100">Under Review</option>
                        <option value="Interviewing" className="bg-slate-900 text-slate-100">Interviewing</option>
                        <option value="Accepted" className="bg-slate-900 text-slate-100">Accepted</option>
                        <option value="Rejected" className="bg-slate-900 text-slate-100">Rejected</option>
                      </select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

