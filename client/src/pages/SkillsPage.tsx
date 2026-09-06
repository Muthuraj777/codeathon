import React, { useEffect, useState } from 'react';
import { useSkillStore } from '../stores/useSkillStore';
import { SkillModal } from '../components/skills/SkillModal';
import type { Skill } from '../types/skill';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { Plus, Search, Filter, Trash2, Edit2, Code2, Layers } from 'lucide-react';

export const SkillsPage: React.FC = () => {
  const {
    skills,
    categories,
    selectedCategory,
    searchQuery,
    isLoading,
    error,
    fetchSkills,
    fetchCategories,
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
    fetchCategories();
  }, [fetchSkills, fetchCategories]);

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
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto text-[#0F172A]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-3">
            <Code2 className="h-7 w-7 text-[#2563EB]" />
            <span>Skills Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage organization-wide technical competencies, category definitions, and proficiency taxonomy.
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenAddModal} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          <span>Add New Skill</span>
        </Button>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Filters & Search Bento Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center glass-bento p-4 rounded-2xl">
        {/* Search */}
        <div className="flex-1">
          <Input
            icon={<Search className="h-4 w-4" />}
            placeholder="Search skills by name (e.g. React, Java, Docker, AWS)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <Filter className="h-4 w-4 text-slate-400 mr-1 shrink-0" />
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#2563EB] text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills Bento Grid */}
      {isLoading && skills.length === 0 ? (
        <div className="py-24 text-center text-slate-500 text-xs flex flex-col items-center justify-center space-y-3">
          <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Fetching technical skills catalog...</span>
        </div>
      ) : skills.length === 0 ? (
        <div className="py-20 text-center glass-bento rounded-3xl p-12">
          <Layers className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-slate-800 font-semibold text-base">No Skills Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
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
                className="glass-bento rounded-2xl p-5 flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition line-clamp-1">
                      {skill.name}
                    </h3>
                    <Badge variant="neutral" className="text-[10px] font-mono shrink-0">
                      {skill.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {skill.description || 'No detailed description specified.'}
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-4 mt-4 border-t border-slate-200/80">
                  <button
                    onClick={() => handleOpenEditModal(skill)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                    title="Edit Skill"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(skillId)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
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
