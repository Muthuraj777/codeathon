import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Briefcase, Building2, Star, ArrowRight, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export const JobsPage: React.FC = () => {
  const jobPositions = [
    {
      id: 'job-1',
      title: 'Java Full Stack Developer',
      company: 'ABC Technologies',
      location: 'Bangalore, India',
      type: 'Full-Time',
      requiredSkills: [
        { name: 'Java', level: 4, mandatory: true },
        { name: 'Spring Boot', level: 4, mandatory: true },
        { name: 'React', level: 3, mandatory: true },
        { name: 'MySQL', level: 3, mandatory: true },
        { name: 'AWS', level: 2, mandatory: false },
      ],
    },
    {
      id: 'job-2',
      title: 'Cloud DevOps Engineer',
      company: 'CloudScale Inc',
      location: 'Remote',
      type: 'Full-Time',
      requiredSkills: [
        { name: 'AWS', level: 4, mandatory: true },
        { name: 'Docker', level: 4, mandatory: true },
        { name: 'Kubernetes', level: 3, mandatory: true },
        { name: 'Python', level: 3, mandatory: false },
      ],
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job Profiles & Requirements</h1>
          <p className="text-sm text-slate-500">Target role definitions and mandatory skill expectations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {jobPositions.map((job) => (
          <Card key={job.id} className="hover:border-indigo-200 transition shadow-sm flex flex-col justify-between">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="primary" className="mb-2">
                    {job.type}
                  </Badge>
                  <CardTitle className="text-xl text-slate-900">{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 text-slate-600 mt-1">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {job.company} &bull; {job.location}
                  </CardDescription>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <Briefcase className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-6 flex-1">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                Required Competencies & Proficiency Levels
              </h4>

              <div className="space-y-2.5">
                {job.requiredSkills.map((req) => (
                  <div
                    key={req.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <Star className={`w-4 h-4 ${req.mandatory ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                      <span className="font-semibold text-slate-800 text-sm">{req.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 font-medium">Req Level: {req.level}</span>
                      <Badge variant={req.mandatory ? 'danger' : 'secondary'} className="text-[10px]">
                        {req.mandatory ? 'Mandatory' : 'Optional'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
              <Link to={`/skill-gap?jobId=${job.id}`} className="w-full">
                <Button variant="primary" className="w-full justify-center">
                  Analyze Candidate Match
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
