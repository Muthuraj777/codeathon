import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useStudentStore } from '../stores/useStudentStore';
import { useSkillStore } from '../stores/useSkillStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Plus, Award, Trash2, Loader2, Sparkles, UserCheck } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const { currentStudent, studentSkills, isLoading, error, fetchStudentProfile, updateProficiency, removeSkill } = useStudentStore();
  const { skills: catalogSkills, fetchSkills } = useSkillStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [selectedProficiency, setSelectedProficiency] = useState<number>(3);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStudentProfile();
    fetchSkills();
  }, [fetchStudentProfile, fetchSkills]);

  const getProficiencyLabel = (level: number) => {
    switch (level) {
      case 1:
        return 'Beginner';
      case 2:
        return 'Basic';
      case 3:
        return 'Intermediate';
      case 4:
        return 'Advanced';
      case 5:
        return 'Expert';
      default:
        return 'Basic';
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId || !currentStudent) return;

    const studentId = currentStudent._id || currentStudent.id;
    try {
      setSubmitting(true);
      await updateProficiency(studentId, selectedSkillId, selectedProficiency);
      setSelectedSkillId('');
      setSelectedProficiency(3);
      setShowAddForm(false);
    } catch (e) {
      // Error handled
    } finally {
      setSubmitting(false);
    }
  };

  const handleLevelClick = async (skillId: string, level: number) => {
    if (!currentStudent) return;
    const studentId = currentStudent._id || currentStudent.id;
    await updateProficiency(studentId, skillId, level);
  };

  const handleRemoveSkill = async (skillId: string) => {
    if (!currentStudent) return;
    if (window.confirm('Are you sure you want to remove this skill competency?')) {
      const studentId = currentStudent._id || currentStudent.id;
      await removeSkill(studentId, skillId);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {error && <Alert type="error" message={error} />}

      {/* SaaS Profile Header Card */}
      <Card className="border-slate-800/80 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/90 backdrop-blur-xl shadow-2xl overflow-hidden relative">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-3xl font-black shadow-xl shadow-indigo-600/30 ring-1 ring-white/20 shrink-0">
            {user?.name ? user.name.charAt(0) : 'E'}
          </div>
          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl font-black text-white tracking-tight">{user?.name || currentStudent?.name || 'Arun'}</h1>
              <Badge variant="primary" dot className="capitalize font-mono-code">
                {user?.role || 'Student'}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-indigo-400 flex items-center justify-center sm:justify-start gap-1">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              {currentStudent?.jobTitle || 'Java Full Stack Developer'}
            </p>
            <p className="text-xs text-slate-400">{user?.email || currentStudent?.email}</p>
          </div>

          <Button variant="glow" size="md" onClick={() => setShowAddForm(!showAddForm)} className="gap-1.5 shrink-0">
            <Plus className="w-4 h-4" />
            <span>Add Skill Competency</span>
          </Button>
        </CardContent>
      </Card>

      {/* Add Skill Form Drawer */}
      {showAddForm && (
        <Card className="border-indigo-500/30 bg-slate-900/80 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Add New Skill Competency Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Select Skill from Catalog *
                  </label>
                  <select
                    value={selectedSkillId}
                    onChange={(e) => setSelectedSkillId(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                  >
                    <option value="">-- Choose a skill --</option>
                    {catalogSkills.map((sk) => (
                      <option key={sk._id || sk.id} value={sk._id || sk.id} className="bg-slate-900 text-slate-100">
                        {sk.name} ({sk.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Proficiency Rating ({selectedProficiency}/5 &mdash; {getProficiencyLabel(selectedProficiency)})
                  </label>
                  <select
                    value={selectedProficiency}
                    onChange={(e) => setSelectedProficiency(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                  >
                    <option value={1}>1 - Beginner</option>
                    <option value={2}>2 - Basic</option>
                    <option value={3}>3 - Intermediate</option>
                    <option value={4}>4 - Advanced</option>
                    <option value={5}>5 - Expert</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-800/80">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Competency'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Skills Assessment Matrix */}
      <Card className="border-slate-800/80 bg-slate-900/70 backdrop-blur-xl shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800/80">
          <div>
            <CardTitle className="flex items-center gap-2 text-white text-lg font-bold">
              <Award className="w-5 h-5 text-indigo-400" />
              <span>Skill Proficiency Matrix</span>
            </CardTitle>
          </div>
          <Badge variant="neutral" className="font-mono-code text-[11px]">
            {studentSkills.length} Verified Competencies
          </Badge>
        </CardHeader>

        <CardContent className="p-6 space-y-5">
          {isLoading && studentSkills.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              <span>Loading candidate skill profile...</span>
            </div>
          ) : studentSkills.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              No skill competencies recorded yet. Click "Add Skill Competency" above to build your profile matrix.
            </div>
          ) : (
            studentSkills.map((s) => {
              const skillId = s.skillId || s.id;
              return (
                <div
                  key={skillId}
                  className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3 shadow-md hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-100 text-base">{s.name}</h4>
                      <span className="text-xs text-slate-400">
                        Category: <strong className="text-indigo-400 font-semibold">{s.category}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="primary" className="text-xs font-mono-code font-semibold">
                        {s.proficiency} / 5 &mdash; {getProficiencyLabel(s.proficiency)}
                      </Badge>
                      <button
                        onClick={() => handleRemoveSkill(skillId)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition rounded-lg hover:bg-slate-800 cursor-pointer"
                        title="Remove skill competency"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Interactive Graphical 5-Level Progress Segment Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800/80 p-0.5">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <div
                          key={lvl}
                          onClick={() => handleLevelClick(skillId, lvl)}
                          className={`h-full flex-1 border-r last:border-r-0 border-slate-950 cursor-pointer transition-all duration-200 ${
                            lvl <= s.proficiency
                              ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:brightness-110'
                              : 'bg-slate-900 hover:bg-slate-800'
                          }`}
                          title={`Click to set proficiency to level ${lvl}`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono-code px-0.5 select-none">
                      <span className="cursor-pointer hover:text-indigo-300" onClick={() => handleLevelClick(skillId, 1)}>1 (Beginner)</span>
                      <span className="cursor-pointer hover:text-indigo-300" onClick={() => handleLevelClick(skillId, 2)}>2 (Basic)</span>
                      <span className="cursor-pointer hover:text-indigo-300" onClick={() => handleLevelClick(skillId, 3)}>3 (Intermediate)</span>
                      <span className="cursor-pointer hover:text-indigo-300" onClick={() => handleLevelClick(skillId, 4)}>4 (Advanced)</span>
                      <span className="cursor-pointer hover:text-indigo-300" onClick={() => handleLevelClick(skillId, 5)}>5 (Expert)</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};
