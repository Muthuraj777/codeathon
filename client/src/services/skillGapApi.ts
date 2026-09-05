import type { Student, Job, SkillGapItem, RecommendationItem, SkillGapResponse } from '../types/skillGap';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Mock Data Source adhering strictly to PDF Architecture (Arun + ABC Tech Job)
export const MOCK_STUDENTS: Student[] = [
  {
    id: 'student-101',
    name: 'Arun',
    email: 'arun@example.com',
    roleTitle: 'Java Full Stack Developer',
    skills: [
      { skillId: 's1', skillName: 'Java', category: 'Backend', proficiency: 4 },
      { skillId: 's2', skillName: 'MySQL', category: 'Database', proficiency: 4 },
      { skillId: 's3', skillName: 'Python', category: 'Backend', proficiency: 3 },
      { skillId: 's4', skillName: 'React', category: 'Frontend', proficiency: 2 },
      { skillId: 's5', skillName: 'AWS', category: 'Cloud', proficiency: 1 },
    ],
  },
  {
    id: 'student-102',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    roleTitle: 'Frontend Engineer',
    skills: [
      { skillId: 's4', skillName: 'React', category: 'Frontend', proficiency: 5 },
      { skillId: 's6', skillName: 'TypeScript', category: 'Frontend', proficiency: 4 },
      { skillId: 's1', skillName: 'Java', category: 'Backend', proficiency: 2 },
      { skillId: 's5', skillName: 'AWS', category: 'Cloud', proficiency: 2 },
    ],
  },
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-501',
    title: 'Java Full Stack Developer',
    company: 'ABC Technologies',
    location: 'Bangalore, India',
    requiredSkills: [
      { skillId: 's1', skillName: 'Java', requiredLevel: 4, mandatory: true },
      { skillId: 's7', skillName: 'Spring Boot', requiredLevel: 4, mandatory: true },
      { skillId: 's4', skillName: 'React', requiredLevel: 3, mandatory: true },
      { skillId: 's2', skillName: 'MySQL', requiredLevel: 3, mandatory: true },
      { skillId: 's5', skillName: 'AWS', requiredLevel: 2, mandatory: false },
    ],
  },
  {
    id: 'job-502',
    title: 'Cloud Architect',
    company: 'CloudScale Inc',
    location: 'Remote',
    requiredSkills: [
      { skillId: 's5', skillName: 'AWS', requiredLevel: 4, mandatory: true },
      { skillId: 's8', skillName: 'Docker', requiredLevel: 4, mandatory: true },
      { skillId: 's2', skillName: 'MySQL', requiredLevel: 3, mandatory: false },
    ],
  },
];

/**
 * Pure Skill Gap Calculation Engine
 */
export function calculateSkillGap(student: Student, job: Job): SkillGapResponse['data'] {
  let weightedScoreSum = 0;
  let totalMaxWeightSum = 0;
  let matchedCount = 0;

  const skillGaps: SkillGapItem[] = job.requiredSkills.map((req) => {
    const candidateSkill = student.skills.find(
      (s) => s.skillId === req.skillId || s.skillName.toLowerCase() === req.skillName.toLowerCase()
    );

    const currentLevel = candidateSkill ? candidateSkill.proficiency : 0;
    const gap = Math.max(req.requiredLevel - currentLevel, 0);
    const status: 'MATCHED' | 'GAP' = currentLevel >= req.requiredLevel ? 'MATCHED' : 'GAP';

    if (status === 'MATCHED') {
      matchedCount++;
    }

    // Weight: Mandatory = 2, Optional = 1
    const weight = req.mandatory ? 2 : 1;
    const skillRatio = Math.min(currentLevel / req.requiredLevel, 1);

    weightedScoreSum += skillRatio * weight;
    totalMaxWeightSum += weight;

    return {
      skillId: req.skillId,
      skillName: req.skillName,
      currentLevel,
      requiredLevel: req.requiredLevel,
      gap,
      mandatory: req.mandatory,
      status,
    };
  });

  const overallMatchScore =
    totalMaxWeightSum > 0 ? Math.round((weightedScoreSum / totalMaxWeightSum) * 100) : 0;

  const recommendations: RecommendationItem[] = skillGaps
    .filter((g) => g.gap > 0)
    .map((g) => {
      let priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
      let reason = '';

      if (g.mandatory) {
        priority = g.gap >= 2 ? 'HIGH' : 'HIGH';
        reason = g.gap >= 2 ? 'Mandatory job requirement & critical gap' : 'Mandatory job requirement';
      } else {
        priority = g.gap >= 2 ? 'MEDIUM' : 'LOW';
        reason = g.gap >= 2 ? 'Required proficiency gap' : 'Required supporting skill deficit';
      }

      return {
        id: `rec-${g.skillId}`,
        skillId: g.skillId,
        skillName: g.skillName,
        currentLevel: g.currentLevel,
        targetLevel: g.requiredLevel,
        priority,
        reason,
      };
    })
    .sort((a, b) => {
      const pOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
      return pOrder[a.priority] - pOrder[b.priority];
    });

  return {
    studentId: student.id,
    studentName: student.name,
    jobId: job.id,
    jobTitle: job.title,
    overallMatchScore,
    matchedCount,
    totalSkillsCount: job.requiredSkills.length,
    skillGaps,
    recommendations,
  };
}

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const skillGapApi = {
  getStudents: async (): Promise<Student[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/students`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.data || data;
    } catch {
      return MOCK_STUDENTS;
    }
  },

  getJobs: async (): Promise<Job[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/jobs`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.data || data;
    } catch {
      return MOCK_JOBS;
    }
  },

  getSkillGap: async (studentId: string, jobId: string): Promise<SkillGapResponse['data']> => {
    try {
      const res = await fetch(`${API_BASE_URL}/students/${studentId}/jobs/${jobId}/skill-gap`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.data;
    } catch {
      const student = MOCK_STUDENTS.find((s) => s.id === studentId) || MOCK_STUDENTS[0];
      const job = MOCK_JOBS.find((j) => j.id === jobId) || MOCK_JOBS[0];
      return calculateSkillGap(student, job);
    }
  },

  getRecommendations: async (studentId: string, jobId: string): Promise<RecommendationItem[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/students/${studentId}/jobs/${jobId}/recommendations`, {
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.data;
    } catch {
      const gapData = await skillGapApi.getSkillGap(studentId, jobId);
      return gapData.recommendations;
    }
  },
};
