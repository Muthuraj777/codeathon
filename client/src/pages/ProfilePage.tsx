import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useStudentStore } from '../stores/useStudentStore';
import { useSkillStore } from '../stores/useSkillStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Plus, Award, Trash2, AlertCircle, Loader2, Sparkles, UserCheck } from 'lucide-react';

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
      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-2xl text-rose-200 text-sm flex items-center space-x-3 backdrop-blur-md">
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Header */}
      <Card className="border-slate-800/80 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden relative">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-xl shadow-indigo-600/30 ring-1 ring-white/20 shrink-0">
            {user?.name ? user.name.charAt(0) : 'E'}
          </div>
          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">{user?.name || currentStudent?.name || 'Arun'}</h1>
              <Badge variant="primary" className="capitalize font-mono">
                {user?.role || 'Student'}
              </Badge>
            </div>
            <p className="text-sm font-semibold text-indigo-400 flex items-center justify-center sm:justify-start gap-1">
              <UserCheck className="w-4 h-4" />
              {currentStudent?.jobTitle || 'Java Full Stack Developer'}
            </p>
            <p className="text-xs text-slate-400">{user?.email || currentStudent?.email}</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowAddForm(!showAddForm)} className="shadow-lg shadow-indigo-600/30 shrink-0">
            <Plus className="w-4 h-4 mr-1.5" /> Add Skill Competency
          </Button>
        </CardContent>
      </Card>

      {/* Add Skill Form */}
      {showAddForm && (
        <Card className="border-indigo-500/30 bg-slate-900/70 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Add New Skill Competency
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
                    className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
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
                    Proficiency Rating ({selectedProficiency}/5 - {getProficiencyLabel(selectedProficiency)})
                  </label>
                  <select
                    value={selectedProficiency}
                    onChange={(e) => setSelectedProficiency(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                  >
                    <option value={1}>1 - Beginner</option>
                    <option value={2}>2 - Basic</option>
                    <option value={3}>3 - Intermediate</option>
                    <option value={4}>4 - Advanced</option>
                    <option value={5}>5 - Expert</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={submitting} className="shadow-lg shadow-indigo-600/30">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Skill'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Skills Assessment Matrix */}
      <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800/80">
          <div>
            <CardTitle className="flex items-center gap-2 text-white text-lg font-bold">
              <Award className="w-5 h-5 text-indigo-400" />
              Skill Proficiency Matrix
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {isLoading && studentSkills.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-sm flex flex-col items-center justify-center space-y-2">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span>Loading skill profile...</span>
            </div>
          ) : studentSkills.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-sm">
              No skill competencies recorded yet. Click "Add Skill Competency" above to build your profile.
            </div>
          ) : (
            studentSkills.map((s) => {
              const skillId = s.skillId || s.id;
              return (
                <div key={skillId} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-100 text-base">{s.name}</h4>
                      <span className="text-xs text-slate-400">Category: <strong className="text-indigo-400">{s.category}</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs font-mono font-semibold bg-slate-900 border-slate-700 text-indigo-300">
                        {s.proficiency} / 5 &mdash; {getProficiencyLabel(s.proficiency)}
                      </Badge>
                      <button
                        onClick={() => handleRemoveSkill(skillId)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition rounded-lg hover:bg-slate-800 cursor-pointer"
                        title="Remove skill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Graphical Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <div
                          key={lvl}
                          onClick={() => handleLevelClick(skillId, lvl)}
                          className={`h-full flex-1 border-r border-slate-950 cursor-pointer transition-all duration-200 ${
                            lvl <= s.proficiency ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110' : 'bg-slate-900 hover:bg-slate-800'
                          }`}
                          title={`Set to level ${lvl}`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono px-0.5">
                      <span>1 (Beginner)</span>
                      <span>2 (Basic)</span>
                      <span>3 (Intermediate)</span>
                      <span>4 (Advanced)</span>
                      <span>5 (Expert)</span>
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

