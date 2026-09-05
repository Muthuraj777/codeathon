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
        (a) => a.studentId === user?.id || a.studentEmail?.toLowerCase() === user?.email?.toLowerCase() || a.studentName === user?.name
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
        return 'purple';
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
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" dot className="px-3 py-1 font-medium text-xs mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Recruitment &amp; Pipeline Suite</span>
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <FileCheck className="w-7 h-7 text-indigo-400" />
            <span>{isAdmin ? 'Recruiter Application Review Board' : 'My Job Applications'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {isAdmin
              ? 'Review candidate submissions, skill match scores, and manage application progression'
              : 'Track submitted job applications and real-time status updates'}
          </p>
        </div>
      </div>

      {successMessage && <Alert type="success" message={successMessage} onClose={clearMessages} />}
      {error && <Alert type="error" message={error} onClose={clearMessages} />}

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800/80 pb-4">
        {['All', 'Submitted', 'Under Review', 'Interviewing', 'Accepted', 'Rejected'].map((st) => {
          const isSelected = filterStatus === st;
          return (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer select-none ${
                isSelected
                  ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700'
                  : 'bg-zinc-900/60 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
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
          <Spinner size="lg" label="Loading application pipeline records..." />
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card className="p-16 text-center text-zinc-500 glass-bento">
          <FileCheck className="w-12 h-12 mx-auto text-zinc-700 mb-3" />
          <h3 className="text-base font-semibold text-zinc-200 mb-1">No Applications Found</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            {isAdmin
              ? 'No candidate applications match the selected filter stage.'
              : "You haven't submitted any job applications yet. Go to Job Profiles or Skill Gap Analyzer to apply!"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApplications.map((app) => (
            <Card key={app.id} className="glass-bento">
              <CardContent className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusBadgeVariant(app.status)} dot className="capitalize text-xs font-mono">
                      {app.status}
                    </Badge>
                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{app.jobTitle}</h3>
                    <p className="text-xs font-medium text-indigo-400 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                      {app.companyName}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <User className="w-4 h-4 text-zinc-500" />
                      Candidate: <strong className="text-zinc-200 ml-1">{app.studentName}</strong> ({app.studentEmail})
                    </span>
                  </div>
                </div>

                {/* Score & Action Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-t md:border-t-0 md:border-l border-zinc-800/80 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] uppercase font-mono font-medium text-zinc-400 tracking-wider">
                      Competency Score
                    </p>
                    <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400 font-mono">{app.matchPercent}%</p>
                  </div>

                  {isAdmin && (
                    <div className="space-y-1.5">
                      <label className="block text-[10px] uppercase font-mono font-medium text-zinc-400 tracking-wider">
                        Update Pipeline Stage
                      </label>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                        className="px-3 py-2 glass-input rounded-xl text-xs font-medium text-zinc-100 focus:outline-none cursor-pointer"
                      >
                        <option value="Submitted" className="bg-zinc-900 text-zinc-100">
                          Submitted
                        </option>
                        <option value="Under Review" className="bg-zinc-900 text-zinc-100">
                          Under Review
                        </option>
                        <option value="Interviewing" className="bg-zinc-900 text-zinc-100">
                          Interviewing
                        </option>
                        <option value="Accepted" className="bg-zinc-900 text-zinc-100">
                          Accepted
                        </option>
                        <option value="Rejected" className="bg-zinc-900 text-zinc-100">
                          Rejected
                        </option>
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
