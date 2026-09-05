import React, { useEffect, useState } from 'react';
import { useSkillStore } from '../stores/useSkillStore';
import { SkillModal } from '../components/skills/SkillModal';
import type { Skill } from '../types/skill';
import { Plus, Search, Filter, Trash2, Edit2, Code2, AlertCircle } from 'lucide-react';

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
    if (window.confirm('Are you sure you want to delete this skill?')) {
      await deleteSkill(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3">
            <Code2 className="h-8 w-8 text-indigo-400" />
            <span>Skills Catalog</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage organization-wide technical skills, categories, and proficiency criteria.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center space-x-2 py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Skill</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-950/60 border border-red-800 rounded-xl text-red-200 text-sm flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search skills by name (e.g. React, Java, Docker)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <Filter className="h-4 w-4 text-slate-500 mr-1 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      {isLoading && skills.length === 0 ? (
        <div className="py-20 text-center text-slate-500 text-sm">Loading skills catalog...</div>
      ) : skills.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/30 border border-slate-800/60 rounded-2xl p-8">
          <Code2 className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-semibold">No skills found</p>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search criteria or add a new skill to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {skills.map((skill) => {
            const skillId = skill._id || skill.id!;
            return (
              <div
                key={skillId}
                className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition shadow-lg flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-slate-100 text-base group-hover:text-indigo-400 transition">
                      {skill.name}
                    </h3>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                      {skill.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {skill.description || 'No description provided.'}
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-4 mt-4 border-t border-slate-800/60">
                  <button
                    onClick={() => handleOpenEditModal(skill)}
                    className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition"
                    title="Edit Skill"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(skillId)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
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
