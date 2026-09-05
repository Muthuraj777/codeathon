import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobStore } from '../stores/useJobStore';
import { useSkillStore } from '../stores/useSkillStore';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Briefcase, Building, MapPin, Plus, Star, ArrowRight, Trash2, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';

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
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-indigo-600" />
            Job Profiles & Skill Requirements
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Define target job roles, minimum proficiency benchmarks, and mandatory skills.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-1" /> Post New Job
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
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
          />

          <div className="space-y-3">
            {isLoading && jobs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">Loading jobs...</div>
            ) : jobs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm bg-white border border-slate-200 rounded-xl">
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
                    className={`cursor-pointer transition hover:border-indigo-300 ${
                      isSelected ? 'border-indigo-600 bg-indigo-50/40 shadow-sm' : 'bg-white border-slate-200'
                    }`}
                  >
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{j.title}</h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteJob(jId);
                          }}
                          className="text-slate-400 hover:text-red-500 p-1"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-600">
                        <span className="flex items-center gap-1 font-semibold text-indigo-600">
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

        {/* Right Column: Job Details & Skill Requirements */}
        <div className="lg:col-span-8 space-y-6">
          {selectedJob ? (
            <>
              <Card className="border-indigo-100">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedJob.title}</h2>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                      <span className="font-semibold text-indigo-600">{selectedJob.company}</span>
                      <span>&bull;</span>
                      <span>{selectedJob.location || 'Remote'}</span>
                    </div>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => handleAnalyzeCandidate(selectedJob._id || selectedJob.id)}>
                    Analyze Candidate <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {selectedJob.description && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Description</h4>
                      <p className="text-sm text-slate-700 leading-relaxed">{selectedJob.description}</p>
                    </div>
                  )}

                  {/* Add Required Skill Form */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                    <h4 className="text-sm font-bold text-slate-900">Add Skill Benchmark Requirement</h4>
                    <form onSubmit={handleAddRequiredSkill} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Select Skill</label>
                        <select
                          value={selectedSkillId}
                          onChange={(e) => setSelectedSkillId(e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">-- Choose skill --</option>
                          {catalogSkills.map((sk) => (
                            <option key={sk._id || sk.id} value={sk._id || sk.id}>
                              {sk.name} ({sk.category})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Level (1-5)</label>
                        <select
                          value={requiredLevel}
                          onChange={(e) => setRequiredLevel(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value={1}>1 - Beginner</option>
                          <option value={2}>2 - Basic</option>
                          <option value={3}>3 - Intermediate</option>
                          <option value={4}>4 - Advanced</option>
                          <option value={5}>5 - Expert</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Mandatory</label>
                        <button
                          type="button"
                          onClick={() => setIsMandatory(!isMandatory)}
                          className={`w-full py-2 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 border ${
                            isMandatory
                              ? 'bg-red-50 text-red-700 border-red-300'
                              : 'bg-slate-100 text-slate-600 border-slate-300'
                          }`}
                        >
                          {isMandatory ? <CheckCircle2 className="w-3.5 h-3.5 text-red-600" /> : <XCircle className="w-3.5 h-3.5" />}
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
                    <h3 className="text-sm font-bold text-slate-900 mb-3">Required Skill Benchmarks</h3>
                    {jobSkills.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No skill requirements defined yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {jobSkills.map((req) => (
                          <div
                            key={req.id || req.skillId}
                            className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 shadow-2xs"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-slate-900 text-sm">{req.name}</span>
                              <Badge variant="secondary" className="text-[10px]">
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
                                    className={`w-4 h-4 ${
                                      star <= req.requiredLevel ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                                    }`}
                                  />
                                ))}
                                <span className="text-xs font-mono font-bold text-slate-700 ml-1">
                                  {req.requiredLevel}/5
                                </span>
                              </div>

                              <button
                                onClick={() => handleRemoveSkill(req.skillId || req.id)}
                                className="text-slate-400 hover:text-red-500 p-1"
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
            <div className="p-12 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
              Select a job profile on the left to view details and skill requirement benchmarks.
            </div>
          )}
        </div>
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">Post New Job Profile</h3>
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
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Job summary and requirements..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
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
