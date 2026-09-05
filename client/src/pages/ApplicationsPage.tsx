import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useApplicationStore } from '../stores/useApplicationStore';
import type { ApplicationStatus } from '../types/application';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import { Spinner } from '../components/ui/Spinner';
import { FileCheck, Building2, User, Clock } from 'lucide-react';

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
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="primary" className="mb-1">
            Application Tracking Platform
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {isAdmin ? 'Recruiter Application Review Board' : 'My Job Applications'}
          </h1>
          <p className="text-sm text-slate-500">
            {isAdmin
              ? 'Review candidate submissions, skill match scores, and update application progression'
              : 'Track submitted job applications and real-time status updates'}
          </p>
        </div>
      </div>

      {successMessage && <Alert type="success" message={successMessage} onClose={clearMessages} />}
      {error && <Alert type="error" message={error} onClose={clearMessages} />}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {['All', 'Submitted', 'Under Review', 'Interviewing', 'Accepted', 'Rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              filterStatus === st
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {isLoading ? (
        <Spinner size="lg" label="Loading application records..." />
      ) : filteredApplications.length === 0 ? (
        <Card className="p-12 text-center text-slate-500">
          <FileCheck className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No Applications Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isAdmin
              ? 'No candidate applications match the selected filter.'
              : "You haven't submitted any job applications yet. Go to Job Profiles or Skill Gap Analyzer to apply!"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApplications.map((app) => (
            <Card key={app.id} className="hover:border-indigo-200 transition shadow-sm">
              <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusBadgeVariant(app.status)} className="capitalize text-xs">
                      {app.status}
                    </Badge>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{app.jobTitle}</h3>
                    <p className="text-xs font-semibold text-indigo-600 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      {app.companyName}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1 font-medium">
                      <User className="w-4 h-4 text-slate-400" />
                      Candidate: <strong className="text-slate-900 ml-1">{app.studentName}</strong> ({app.studentEmail})
                    </span>
                  </div>
                </div>

                {/* Score & Action Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-center sm:text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Match Score</p>
                    <p className="text-2xl font-black text-indigo-600">{app.matchPercent}%</p>
                  </div>

                  {isAdmin && (
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold text-slate-400">Update Status</label>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
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
