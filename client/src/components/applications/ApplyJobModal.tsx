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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-zinc-900/95 rounded-3xl border border-zinc-800 shadow-2xl w-full max-w-lg overflow-hidden backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-zinc-950/60 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight flex items-center gap-1.5">
                <span>Submit Application</span>
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </h3>
              <p className="text-xs text-zinc-400">Review application parameters before sending</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="p-4 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold text-zinc-100 text-base leading-snug">{job.title}</h4>
                <p className="text-xs text-indigo-400 flex items-center gap-1 mt-1 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                  {job.company}
                </p>
              </div>
              <Badge variant="primary" className="text-xs shrink-0 font-mono">
                {matchPercent}% Match
              </Badge>
            </div>
          </div>

          <div className="space-y-2 border-t border-zinc-800/80 pt-4">
            <h5 className="text-[11px] font-mono font-medium uppercase text-zinc-400 tracking-wider">
              Candidate Profile Credentials
            </h5>
            <div className="p-4 bg-indigo-950/20 rounded-2xl border border-indigo-800/40 space-y-1">
              <p className="text-sm font-semibold text-zinc-100">{user?.name || 'Arun'}</p>
              <p className="text-xs text-zinc-400">{user?.email || 'arun@example.com'}</p>
              <Badge variant="success" className="capitalize text-[10px] mt-1 font-mono">
                {user?.role || 'Student'}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3.5 bg-emerald-950/30 rounded-xl border border-emerald-800/50 text-xs text-emerald-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Your match score of <strong className="text-emerald-200 font-mono">{matchPercent}%</strong> will be attached to your submission.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/80">
            <Button type="button" variant="ghost" onClick={onClose} size="md">
              Cancel
            </Button>
            <Button type="submit" variant="glow" size="md" isLoading={isSubmitting}>
              <Send className="w-4 h-4 mr-2" />
              Confirm &amp; Submit Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
