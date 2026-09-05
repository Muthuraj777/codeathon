import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobStore } from '../stores/useJobStore';
import { useSkillStore } from '../stores/useSkillStore';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Briefcase, Building, MapPin, Plus, Star, ArrowRight, Trash2, CheckCircle2, XCircle, AlertCircle, Loader2, Sparkles, Target } from 'lucide-react';

export const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { jobs, selectedJob, jobSkills, isLoading, error, fetchJobs, fetchJobDetails, createJob, updateRequiredSkill, removeRequiredSkill, deleteJob } = useJobStore();
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
    <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Target Role Specifications</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-indigo-400" />
            Job Profiles &amp; Skill Benchmarks
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Define target job roles, minimum proficiency benchmarks, and mandatory skill requirements.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)} className="shrink-0 shadow-lg shadow-indigo-600/30">
          <Plus className="w-4 h-4 mr-1.5" /> Post New Job
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-2xl text-rose-200 text-sm flex items-center gap-3 backdrop-blur-md">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Job List */}
        <div className="lg:col-span-4 space-y-4">
          <Input
            placeholder="Search jobs or companies..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              fetchJobs(e.target.value);
            }}
            className="bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-500 focus:border-indigo-500"
          />

          <div className="space-y-3">
            {isLoading && jobs.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm flex flex-col items-center justify-center space-y-2">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading job postings...</span>
              </div>
            ) : jobs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm bg-slate-900/40 border border-slate-800/80 rounded-2xl backdrop-blur-md">
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
                    className={`cursor-pointer transition-all duration-200 backdrop-blur-xl ${
                      isSelected
                        ? 'border-indigo-500/80 bg-indigo-950/20 shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-500/30'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-slate-100 text-base">{j.title}</h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteJob(jId);
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1 transition rounded-lg hover:bg-slate-800/60"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1 font-semibold text-indigo-400">
                          <Building className="w-3.5 h-3.5" /> {j.company}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
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

        {/* Right Column: Job Details & Skill Requirements */}
        <div className="lg:col-span-8 space-y-6">
          {selectedJob ? (
            <>
              <Card className="border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{selectedJob.title}</h2>
                    <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                      <span className="font-semibold text-indigo-400 flex items-center gap-1">
                        <Building className="w-4 h-4" /> {selectedJob.company}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {selectedJob.location || 'Remote'}
                      </span>
                    </div>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => handleAnalyzeCandidate(selectedJob._id || selectedJob.id)} className="shadow-md shadow-indigo-600/30">
                    Analyze Candidate <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {selectedJob.description && (
                    <div>
                      <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">Description</h4>
                      <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
                        {selectedJob.description}
                      </p>
                    </div>
                  )}

                  {/* Add Required Skill Form */}
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-inner">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-400" />
                      Add Skill Benchmark Requirement
                    </h4>
                    <form onSubmit={handleAddRequiredSkill} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-5">
                        <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Select Skill</label>
                        <select
                          value={selectedSkillId}
                          onChange={(e) => setSelectedSkillId(e.target.value)}
                          required
                          className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                        >
                          <option value="">-- Choose skill --</option>
                          {catalogSkills.map((sk) => (
                            <option key={sk._id || sk.id} value={sk._id || sk.id} className="bg-slate-900 text-slate-100">
                              {sk.name} ({sk.category})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Benchmark (1-5)</label>
                        <select
                          value={requiredLevel}
                          onChange={(e) => setRequiredLevel(Number(e.target.value))}
                          className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                        >
                          <option value={1}>1 - Beginner</option>
                          <option value={2}>2 - Basic</option>
                          <option value={3}>3 - Intermediate</option>
                          <option value={4}>4 - Advanced</option>
                          <option value={5}>5 - Expert</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Mandatory</label>
                        <button
                          type="button"
                          onClick={() => setIsMandatory(!isMandatory)}
                          className={`w-full py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 border cursor-pointer ${
                            isMandatory
                              ? 'bg-rose-950/40 text-rose-300 border-rose-800/80'
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}
                        >
                          {isMandatory ? <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-500" />}
                          {isMandatory ? 'Yes' : 'No'}
                        </button>
                      </div>

                      <div className="sm:col-span-2">
                        <Button type="submit" variant="primary" size="sm" className="w-full" disabled={addingSkill}>
                          {addingSkill ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
                        </Button>
                      </div>
                    </form>
                  </div>

                  {/* Required Skills List */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-200 mb-3 uppercase tracking-wider text-xs">Required Skill Benchmarks</h3>
                    {jobSkills.length === 0 ? (
                      <p className="text-xs text-slate-500 italic p-4 bg-slate-950/30 rounded-xl border border-slate-800/50">
                        No skill requirements defined yet for this role profile.
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {jobSkills.map((req) => (
                          <div
                            key={req.id || req.skillId}
                            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 shadow-md"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-slate-100 text-sm">{req.name}</span>
                              <Badge variant="secondary" className="text-[10px] bg-slate-900 border-slate-700 text-slate-300">
                                {req.category}
                              </Badge>
                              {req.mandatory ? (
                                <Badge variant="danger" className="text-[10px]">
                                  Mandatory
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-[10px]">
                                  Optional
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1" title={`Required level: ${req.requiredLevel}`}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3.5 h-3.5 ${
                                      star <= req.requiredLevel ? 'fill-amber-400 text-amber-400' : 'text-slate-800'
                                    }`}
                                  />
                                ))}
                                <span className="text-xs font-mono font-bold text-indigo-300 ml-1">
                                  {req.requiredLevel}/5
                                </span>
                              </div>

                              <button
                                onClick={() => handleRemoveSkill(req.skillId || req.id)}
                                className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
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
            </>
          ) : (
            <div className="p-16 text-center text-slate-500 bg-slate-900/40 border border-slate-800/80 rounded-3xl backdrop-blur-xl">
              <Briefcase className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="font-semibold text-slate-300">No Job Selected</p>
              <p className="text-xs text-slate-500 mt-1">Select a job profile from the list to view requirements.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl shadow-indigo-950/50">
            <div className="p-5 border-b border-slate-800/80 bg-slate-950/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                Post New Job Profile
              </h3>
            </div>
            <form onSubmit={handleCreateJob} className="p-6 space-y-4">
              <Input
                label="Company Name *"
                placeholder="e.g. ABC Technologies, Google"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500"
                required
              />
              <Input
                label="Job Title *"
                placeholder="e.g. Java Full Stack Developer"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500"
                required
              />
              <Input
                label="Location"
                placeholder="e.g. New York, NY or Remote"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus:border-indigo-500"
              />
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Job summary and role requirements..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none transition"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800/80">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="shadow-lg shadow-indigo-600/30">
                  Create Job Post
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

