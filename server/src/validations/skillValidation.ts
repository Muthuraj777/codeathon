import { z } from 'zod';

export const createSkillSchema = z.object({
  name: z.string().trim().min(2, 'Skill name must be at least 2 characters').max(50),
  category: z.enum(['Backend', 'Frontend', 'Database', 'Cloud', 'DevOps', 'Mobile', 'AI/ML', 'Other']),
  description: z.string().trim().max(250).optional(),
});

export const updateSkillSchema = z.object({
  name: z.string().trim().min(2, 'Skill name must be at least 2 characters').max(50).optional(),
  category: z.enum(['Backend', 'Frontend', 'Database', 'Cloud', 'DevOps', 'Mobile', 'AI/ML', 'Other']).optional(),
  description: z.string().trim().max(250).optional(),
});
