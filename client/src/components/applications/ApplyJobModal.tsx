import React from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useApplicationStore } from '../../stores/useApplicationStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { X, Send, Building2, CheckCircle2, Sparkles } from 'lucide-react';

interface ApplyJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: string;
    title: string;
    company: string;
  };
  matchPercent: number;
}

export const ApplyJobModal: React.FC<ApplyJobModalProps> = ({ isOpen, onClose, job, matchPercent }) => {
  const { user } = useAuthStore();
  const { submitApplication, isSubmitting } = useApplicationStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitApplication({
      studentId: user?.id || 'student-101',
      studentName: user?.name || 'Arun',
      studentEmail: user?.email || 'arun@example.com',
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.company,
      matchPercent,
    });

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden backdrop-blur-2xl text-[#0F172A]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-600">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                <span>Submit Application</span>
                <Sparkles className="w-4 h-4 text-blue-600" />
              </h3>
              <p className="text-xs text-slate-500">Review application parameters before sending</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold text-slate-900 text-base leading-snug">{job.title}</h4>
                <p className="text-xs text-blue-600 flex items-center gap-1 mt-1 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {job.company}
                </p>
              </div>
              <Badge variant="primary" className="text-xs shrink-0 font-mono">
                {matchPercent}% Match
              </Badge>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-200 pt-4">
            <h5 className="text-[11px] font-mono font-medium uppercase text-slate-500 tracking-wider">
              Candidate Profile Credentials
            </h5>
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200/80 space-y-1">
              <p className="text-sm font-semibold text-slate-900">{user?.name || 'Arun'}</p>
              <p className="text-xs text-slate-500">{user?.email || 'arun@example.com'}</p>
              <Badge variant="success" className="capitalize text-[10px] mt-1 font-mono">
                {user?.role || 'Student'}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Your match score of <strong className="text-emerald-950 font-mono">{matchPercent}%</strong> will be attached to your submission.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <Button type="button" variant="ghost" onClick={onClose} size="md">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
              <Send className="w-4 h-4 mr-2" />
              Confirm &amp; Submit Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
