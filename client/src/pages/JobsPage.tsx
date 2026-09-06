import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobStore } from '../stores/useJobStore';
import { useSkillStore } from '../stores/useSkillStore';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import {
  Briefcase,
  Building,
  MapPin,
  Plus,
  Star,
  ArrowRight,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  Target,
  Search,
  X,
  FileSpreadsheet,
} from 'lucide-react';

export const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    jobs,
    selectedJob,
    jobSkills,
    isLoading,
    error,
    fetchJobs,
    fetchJobDetails,
    createJob,
    updateRequiredSkill,
    removeRequiredSkill,
    deleteJob,
  } = useJobStore();
  const { skills: catalogSkills, fetchSkills } = useSkillStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('Remote');
  const [newDescription, setNewDescription] = useState('');

  // Skill requirement state
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [requiredLevel, setRequiredLevel] = useState<number>(3);
  const [isMandatory, setIsMandatory] = useState<boolean>(true);
  const [addingSkill, setAddingSkill] = useState(false);

  useEffect(() => {
    fetchJobs();
    fetchSkills();
  }, [fetchJobs, fetchSkills]);

  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      const firstId = jobs[0]._id || jobs[0].id;
      fetchJobDetails(firstId);
    }
  }, [jobs, selectedJob, fetchJobDetails]);

  const handleSelectJob = (jobId: string) => {
    fetchJobDetails(jobId);
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newTitle.trim()) return;
    try {
      await createJob({
        company: newCompany.trim(),
        title: newTitle.trim(),
        location: newLocation.trim() || 'Remote',
        description: newDescription.trim(),
      });
      setShowCreateModal(false);
      setNewCompany('');
      setNewTitle('');
      setNewDescription('');
    } catch (e) {
      // Error handled
    }
  };

  const handleAddRequiredSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !selectedSkillId) return;

    const jobId = selectedJob._id || selectedJob.id;
    try {
      setAddingSkill(true);
      await updateRequiredSkill(jobId, selectedSkillId, requiredLevel, isMandatory);
      setSelectedSkillId('');
      setRequiredLevel(3);
    } catch (e) {
      // Error handled
    } finally {
      setAddingSkill(false);
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    if (!selectedJob) return;
    const jobId = selectedJob._id || selectedJob.id;
    await removeRequiredSkill(jobId, skillId);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job profile?')) {
      await deleteJob(jobId);
    }
  };

  const handleAnalyzeCandidate = (jobId: string) => {
    navigate(`/skill-gap?jobId=${jobId}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in text-[#0F172A]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-3">
            <Briefcase className="w-7 h-7 text-[#2563EB]" />
            <span>Job Profiles &amp; Skill Benchmarks</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Define target job roles, minimum proficiency benchmarks, and mandatory skill requirements.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)} className="shrink-0 gap-2">
          <Plus className="w-4 h-4" />
          <span>Post New Job</span>
        </Button>
      </div>

      {error && <Alert type="error" message={error} />}

      {/* Main Master-Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Master List Column */}
        <div className="lg:col-span-4 space-y-4">
          <Input
            icon={<Search className="w-4 h-4" />}
            placeholder="Search jobs or companies..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              fetchJobs(e.target.value);
            }}
          />

          <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
            {isLoading && jobs.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span>Loading job postings...</span>
              </div>
            ) : jobs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs glass-bento rounded-2xl">
                No job postings found. Click "Post New Job" to create one.
              </div>
            ) : (
              jobs.map((j) => {
                const jId = j._id || j.id;
                const isSelected = selectedJob && (selectedJob._id === jId || selectedJob.id === jId);
                return (
                  <Card
                    key={jId}
                    onClick={() => handleSelectJob(jId)}
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 shadow-sm ring-1 ring-blue-500/40'
                        : 'glass-bento hover:border-slate-300'
                    }`}
                  >
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-900 text-sm sm:text-base leading-snug">{j.title}</h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteJob(jId);
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1 transition rounded-lg hover:bg-slate-100"
                          title="Delete Job Profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1 font-medium text-blue-600">
                          <Building className="w-3.5 h-3.5" /> {j.company}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3.5 h-3.5" /> {j.location || 'Remote'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail Column */}
        <div className="lg:col-span-8 space-y-6">
          {selectedJob ? (
            <Card className="glass-bento shadow-md">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{selectedJob.title}</h2>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500">
                    <span className="font-medium text-blue-600 flex items-center gap-1">
                      <Building className="w-4 h-4 text-blue-600" /> {selectedJob.company}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-slate-400" /> {selectedJob.location || 'Remote'}
                    </span>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAnalyzeCandidate(selectedJob._id || selectedJob.id)}
                  className="shrink-0 gap-1.5"
                >
                  <span>Analyze Candidate Match</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {selectedJob.description && (
                  <div>
                    <h4 className="text-[11px] font-mono font-medium uppercase tracking-wider text-slate-500 mb-1.5">
                      Role Overview &amp; Specifications
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                      {selectedJob.description}
                    </p>
                  </div>
                )}

                {/* Add Skill Requirement Form */}
                <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    Configure Required Skill Benchmark
                  </h4>
                  <form onSubmit={handleAddRequiredSkill} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-5">
                      <label className="block text-[10px] font-mono font-medium text-slate-500 uppercase tracking-wider mb-1">
                        Select Skill from Taxonomy
                      </label>
                      <select
                        value={selectedSkillId}
                        onChange={(e) => setSelectedSkillId(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-medium text-slate-900 focus:outline-none cursor-pointer"
                      >
                        <option value="">-- Choose skill --</option>
                        {catalogSkills.map((sk) => (
                          <option key={sk._id || sk.id} value={sk._id || sk.id} className="bg-white text-slate-900">
                            {sk.name} ({sk.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-mono font-medium text-slate-500 uppercase tracking-wider mb-1">
                        Proficiency Benchmark (1-5)
                      </label>
                      <select
                        value={requiredLevel}
                        onChange={(e) => setRequiredLevel(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs font-medium text-slate-900 focus:outline-none cursor-pointer"
                      >
                        <option value={1}>1 - Beginner</option>
                        <option value={2}>2 - Basic</option>
                        <option value={3}>3 - Intermediate</option>
                        <option value={4}>4 - Advanced</option>
                        <option value={5}>5 - Expert</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-mono font-medium text-slate-500 uppercase tracking-wider mb-1">
                        Mandatory
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsMandatory(!isMandatory)}
                        className={`w-full py-2 px-2 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1 border cursor-pointer ${
                          isMandatory
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        {isMandatory ? <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" /> : <XCircle className="w-3.5 h-3.5 text-slate-400" />}
                        {isMandatory ? 'Yes' : 'No'}
                      </button>
                    </div>

                    <div className="sm:col-span-2">
                      <Button type="submit" variant="primary" size="md" className="w-full" disabled={addingSkill}>
                        {addingSkill ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Required Skills Matrix List */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Active Required Skill Benchmarks</span>
                    <Badge variant="neutral" className="font-mono">
                      {jobSkills.length} Skills Configured
                    </Badge>
                  </h3>

                  {jobSkills.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 italic bg-slate-50/60 rounded-2xl border border-slate-200/80">
                      No skill requirements defined yet for this role profile. Add one using the form above.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {jobSkills.map((req) => (
                        <div
                          key={req.id || req.skillId}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-white/90 border border-slate-200/90 hover:border-slate-300 transition shadow-2xs gap-3"
                        >
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-semibold text-slate-900 text-sm">{req.name}</span>
                            <Badge variant="neutral" className="text-[10px]">
                              {req.category}
                            </Badge>
                            {req.mandatory ? (
                              <Badge variant="danger" dot className="text-[10px]">
                                Mandatory
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[10px]">
                                Optional
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="flex items-center gap-1" title={`Required level: ${req.requiredLevel}`}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3.5 h-3.5 ${
                                    star <= req.requiredLevel ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                                  }`}
                                />
                              ))}
                              <span className="text-xs font-mono font-semibold text-blue-700 ml-1.5">
                                {req.requiredLevel}/5
                              </span>
                            </div>

                            <button
                              onClick={() => handleRemoveSkill(req.skillId || req.id)}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                              title="Remove skill requirement"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="p-16 text-center text-slate-400 glass-bento rounded-3xl space-y-2">
              <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700 text-base">No Job Selected</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Select a job profile from the master list on the left to view or configure its skill requirements.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Post New Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl backdrop-blur-2xl text-[#0F172A]">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span>Post New Job Profile</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="p-6 space-y-4">
              <Input
                label="Company Name *"
                placeholder="e.g. ABC Technologies, Google"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                required
              />
              <Input
                label="Job Title *"
                placeholder="e.g. Java Full Stack Developer"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
              <Input
                label="Location"
                placeholder="e.g. New York, NY or Remote"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
              />
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Job Description &amp; Role Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter job summary and key responsibilities..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none transition"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md">
                  Post Job Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
