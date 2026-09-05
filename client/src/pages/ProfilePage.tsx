import React, { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, Award } from 'lucide-react';

interface SkillItem {
  id: string;
  name: string;
  level: number;
  category: string;
}

export const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const [skills, setSkills] = useState<SkillItem[]>([
    { id: '1', name: 'Java', level: 4, category: 'Backend' },
    { id: '2', name: 'MySQL', level: 4, category: 'Database' },
    { id: '3', name: 'Python', level: 3, category: 'Backend' },
    { id: '4', name: 'React', level: 2, category: 'Frontend' },
    { id: '5', name: 'AWS', level: 1, category: 'Cloud' },
  ]);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<number>(3);
  const [showAddForm, setShowAddForm] = useState(false);

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

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setSkills((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newSkillName.trim(),
        level: newSkillLevel,
        category: 'General',
      },
    ]);
    setNewSkillName('');
    setNewSkillLevel(3);
    setShowAddForm(false);
  };

  const updateSkillLevel = (id: string, newLevel: number) => {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, level: newLevel } : s)));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Profile Header */}
      <Card className="border-indigo-100 bg-gradient-to-r from-white via-indigo-50/30 to-white shadow-sm">
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-indigo-500/30 shrink-0">
            {user?.name ? user.name.charAt(0) : 'E'}
          </div>
          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{user?.name || 'Arun'}</h1>
              <Badge variant="primary" className="capitalize">
                {user?.role || 'Student'}
              </Badge>
            </div>
            <p className="text-sm font-semibold text-indigo-600">Java Full Stack Developer</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-1" /> Add Skill
          </Button>
        </CardContent>
      </Card>

      {/* Add Skill Form */}
      {showAddForm && (
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardHeader>
            <CardTitle className="text-base text-slate-900">Add New Skill Competency</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Skill Name"
                  placeholder="e.g. Spring Boot, Docker, GraphQL"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Proficiency Level ({newSkillLevel}/5 - {getProficiencyLabel(newSkillLevel)})
                  </label>
                  <select
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={1}>1 - Beginner</option>
                    <option value={2}>2 - Basic</option>
                    <option value={3}>3 - Intermediate</option>
                    <option value={4}>4 - Advanced</option>
                    <option value={5}>5 - Expert</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Skill
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Skills Assessment Matrix */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Award className="w-5 h-5 text-indigo-600" />
              Skill Proficiency Matrix
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {skills.map((s) => (
            <div key={s.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{s.name}</h4>
                  <span className="text-xs text-slate-500">Category: {s.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs font-semibold">
                    {s.level} / 5 &mdash; {getProficiencyLabel(s.level)}
                  </Badge>
                </div>
              </div>

              {/* Graphical Progress Bar */}
              <div className="space-y-1">
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <div
                      key={lvl}
                      onClick={() => updateSkillLevel(s.id, lvl)}
                      className={`h-full flex-1 border-r border-white cursor-pointer transition ${
                        lvl <= s.level ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-200 hover:bg-slate-300'
                      }`}
                      title={`Set to level ${lvl}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono px-0.5">
                  <span>1 (Beginner)</span>
                  <span>2 (Basic)</span>
                  <span>3 (Intermediate)</span>
                  <span>4 (Advanced)</span>
                  <span>5 (Expert)</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
