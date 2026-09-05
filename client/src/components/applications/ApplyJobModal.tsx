import React from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useApplicationStore } from '../../stores/useApplicationStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { X, Send, Building2, CheckCircle2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">Submit Job Application</h3>
              <p className="text-xs text-slate-400">Review details before sending your application</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-base">{job.title}</h4>
                <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {job.company}
                </p>
              </div>
              <Badge variant="primary" className="text-xs">
                {matchPercent}% Match
              </Badge>
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <h5 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Candidate Profile</h5>
            <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 space-y-1">
              <p className="text-sm font-bold text-slate-900">{user?.name || 'Arun'}</p>
              <p className="text-xs text-slate-600">{user?.email || 'arun@example.com'}</p>
              <Badge variant="success" className="capitalize text-[10px] mt-1">
                {user?.role || 'Student'}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Your calculated skill match score of <strong>{matchPercent}%</strong> will be sent to recruiters.</span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} size="md">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
              <Send className="w-4 h-4 mr-2" />
              Confirm & Submit Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
