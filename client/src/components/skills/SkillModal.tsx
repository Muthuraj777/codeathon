import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Skill, SkillCategory } from '../../types/skill';
import { X, Loader2, Code2 } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center space-x-2">
            <Code2 className="h-5 w-5 text-indigo-400" />
            <h3 className="font-bold text-slate-100 text-lg">
              {initialData ? 'Edit Skill' : 'Add New Skill'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-red-950/60 border border-red-800 text-red-200 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Skill Name *
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="e.g. Spring Boot, React, Docker"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Category *
            </label>
            <select
              {...register('category')}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-400">{errors.category.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Brief summary or description of the technology..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
            />
            {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/20 flex items-center space-x-2 disabled:opacity-50 transition"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span>{initialData ? 'Update Skill' : 'Create Skill'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
