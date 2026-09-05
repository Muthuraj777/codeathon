export interface StudentSkill {
  skillId: string;
  skillName: string;
  category: string;
  proficiency: number; // 1 to 5
}

export interface Student {
  id: string;
  name: string;
  email: string;
  roleTitle: string;
  skills: StudentSkill[];
}

export interface JobSkill {
  skillId: string;
  skillName: string;
  requiredLevel: number; // 1 to 5
  mandatory: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  requiredSkills: JobSkill[];
}

export interface SkillGapItem {
  skillId: string;
  skillName: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number; // Math.max(requiredLevel - currentLevel, 0)
  mandatory: boolean;
  status: 'MATCHED' | 'GAP';
}

export interface RecommendationItem {
  id: string;
  skillId: string;
  skillName: string;
  currentLevel: number;
  targetLevel: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
}

export interface SkillGapResponse {
  status: 'success';
  data: {
    studentId: string;
    studentName: string;
    jobId: string;
    jobTitle: string;
    overallMatchScore: number; // 0 to 100
    matchedCount: number;
    totalSkillsCount: number;
    skillGaps: SkillGapItem[];
    recommendations: RecommendationItem[];
  };
}
