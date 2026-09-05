import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Skill, SkillCategory } from '../../types/skill';
import { X, Code2, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const skillSchema = z.object({
  name: z.string().trim().min(2, 'Skill name must be at least 2 characters').max(50),
  category: z.enum(['Backend', 'Frontend', 'Database', 'Cloud', 'DevOps', 'Mobile', 'AI/ML', 'Other']),
  description: z.string().trim().max(250).optional(),
});

type SkillFormData = z.infer<typeof skillSchema>;

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SkillFormData) => Promise<void>;
  initialData?: Skill | null;
  isLoading: boolean;
  error?: string | null;
}

export const SkillModal: React.FC<SkillModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  error,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      category: 'Backend',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        category: initialData.category,
        description: initialData.description || '',
      });
    } else {
      reset({
        name: '',
        category: 'Backend',
        description: '',
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  const categories: SkillCategory[] = [
    'Backend',
    'Frontend',
    'Database',
    'Cloud',
    'DevOps',
    'Mobile',
    'AI/ML',
    'Other',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl shadow-indigo-950/50 backdrop-blur-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-lg flex items-center gap-1.5">
                <span>{initialData ? 'Edit Skill Profile' : 'Create New Skill'}</span>
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </h3>
              <p className="text-[11px] text-slate-400">Define technical competency criteria</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-950/40 border border-rose-800/80 text-rose-200 rounded-xl">
              {error}
            </div>
          )}

          <Input
            label="Skill Name *"
            placeholder="e.g. Spring Boot, React, Docker, PyTorch"
            error={errors.name?.message}
            {...register('name')}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Domain Category *
            </label>
            <select
              {...register('category')}
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs sm:text-sm transition cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-slate-100">
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-xs text-rose-400">{errors.category.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Brief summary or proficiency description of the technology..."
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs sm:text-sm resize-none transition"
            />
            {errors.description && <p className="mt-1 text-xs text-rose-400">{errors.description.message}</p>}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800/80">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
              {initialData ? 'Update Skill' : 'Create Skill'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
