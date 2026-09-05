import { z } from 'zod';

export const createStudentSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Invalid email address'),
  jobTitle: z.string().trim().max(100).optional(),
});

export const updateStudentSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100).optional(),
  email: z.string().trim().email('Invalid email address').optional(),
  jobTitle: z.string().trim().max(100).optional(),
});

export const addOrUpdateStudentSkillSchema = z.object({
  skill_id: z.string().min(1, 'Skill ID is required'),
  proficiency: z.number().int().min(1, 'Proficiency must be between 1 and 5').max(5, 'Proficiency must be between 1 and 5'),
});
