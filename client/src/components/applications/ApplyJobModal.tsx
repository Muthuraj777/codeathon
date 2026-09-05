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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl shadow-indigo-950/50 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-slate-950/60 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight flex items-center gap-1.5">
                Submit Job Application
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </h3>
              <p className="text-xs text-slate-400">Review details before sending application to recruiters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-bold text-slate-100 text-base">{job.title}</h4>
                <p className="text-xs text-indigo-400 flex items-center gap-1 mt-0.5 font-semibold">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {job.company}
                </p>
              </div>
              <Badge variant="primary" className="text-xs shrink-0 font-mono">
                {matchPercent}% Match
              </Badge>
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-800/80 pt-4">
            <h5 className="text-[11px] font-mono font-bold uppercase text-slate-400 tracking-wider">Candidate Profile Details</h5>
            <div className="p-3.5 bg-indigo-950/20 rounded-xl border border-indigo-800/40 space-y-1">
              <p className="text-sm font-bold text-slate-100">{user?.name || 'Arun'}</p>
              <p className="text-xs text-slate-400">{user?.email || 'arun@example.com'}</p>
              <Badge variant="success" className="capitalize text-[10px] mt-1">
                {user?.role || 'Student'}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3.5 bg-emerald-950/40 rounded-xl border border-emerald-800/60 text-xs text-emerald-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Your calculated match score of <strong className="text-emerald-200 font-mono">{matchPercent}%</strong> will be attached to your application submission.</span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800/80">
            <Button type="button" variant="ghost" onClick={onClose} size="md">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} className="shadow-lg shadow-indigo-600/30">
              <Send className="w-4 h-4 mr-2" />
              Confirm &amp; Submit Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

