export type SkillCategory = 'Backend' | 'Frontend' | 'Database' | 'Cloud' | 'DevOps' | 'Mobile' | 'AI/ML' | 'Other';

export interface Skill {
  _id: string;
  id?: string;
  name: string;
  category: SkillCategory;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillResponse {
  status: string;
  results?: number;
  data: {
    skills?: Skill[];
    skill?: Skill;
    categories?: string[];
  };
  message?: string;
}
