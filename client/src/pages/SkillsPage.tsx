import React, { useEffect, useState } from 'react';
import { useSkillStore } from '../stores/useSkillStore';
import { SkillModal } from '../components/skills/SkillModal';
import type { Skill } from '../types/skill';
import { Plus, Search, Filter, Trash2, Edit2, Code2, AlertCircle, Sparkles, Layers } from 'lucide-react';

export const SkillsPage: React.FC = () => {
  const {
    skills,
    categories,
    selectedCategory,
    searchQuery,
    isLoading,
    error,
    fetchSkills,
    createSkill,
    updateSkill,
    deleteSkill,
    setSelectedCategory,
    setSearchQuery,
  } = useSkillStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleOpenAddModal = () => {
    setEditingSkill(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  const handleSubmitModal = async (data: any) => {
    if (editingSkill) {
      const id = editingSkill._id || editingSkill.id!;
      await updateSkill(id, data);
    } else {
      await createSkill(data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this skill profile?')) {
      await deleteSkill(id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Technical Taxonomy Catalog</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Code2 className="h-8 w-8 text-indigo-400" />
            <span>Skills Directory</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage organization-wide technical competencies, category definitions, and proficiency taxonomy.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center space-x-2 py-3 px-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-2xl text-rose-200 text-sm flex items-center space-x-3 backdrop-blur-md">
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-xl shadow-xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search skills by name (e.g. React, Java, Docker, AWS)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <Filter className="h-4 w-4 text-slate-500 mr-1 shrink-0" />
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/40'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills Grid */}
      {isLoading && skills.length === 0 ? (
        <div className="py-24 text-center text-slate-500 text-sm flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Fetching technical skills catalog...</span>
        </div>
      ) : skills.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/40 border border-slate-800/60 rounded-3xl p-12 backdrop-blur-md">
          <Layers className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-slate-200 font-bold text-lg">No Skills Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No technical skills matching your current search or category filter. Try clearing filters or create a new skill entry.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {skills.map((skill) => {
            const skillId = skill._id || skill.id!;
            return (
              <div
                key={skillId}
                className="bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/50 rounded-2xl p-5 backdrop-blur-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-indigo-950/50 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-bold text-slate-100 text-base group-hover:text-indigo-300 transition line-clamp-1">
                      {skill.name}
                    </h3>
                    <span className="px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider bg-slate-950 text-indigo-300 rounded-lg border border-slate-800 shrink-0">
                      {skill.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {skill.description || 'No detailed description specified.'}
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-4 mt-4 border-t border-slate-800/60">
                  <button
                    onClick={() => handleOpenEditModal(skill)}
                    className="p-2 text-slate-400 hover:text-indigo-300 hover:bg-slate-800/80 rounded-xl transition cursor-pointer"
                    title="Edit Skill"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(skillId)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition cursor-pointer"
                    title="Delete Skill"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <SkillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitModal}
        initialData={editingSkill}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

