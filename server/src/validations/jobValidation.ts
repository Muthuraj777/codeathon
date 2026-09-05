import { z } from 'zod';

export const createJobSchema = z.object({
  company: z.string().trim().min(2, 'Company name must be at least 2 characters').max(100),
  title: z.string().trim().min(2, 'Job title must be at least 2 characters').max(100),
  location: z.string().trim().max(100).optional(),
  description: z.string().trim().max(1000).optional(),
});

export const updateJobSchema = z.object({
  company: z.string().trim().min(2, 'Company name must be at least 2 characters').max(100).optional(),
  title: z.string().trim().min(2, 'Job title must be at least 2 characters').max(100).optional(),
  location: z.string().trim().max(100).optional(),
  description: z.string().trim().max(1000).optional(),
});

export const addOrUpdateJobSkillSchema = z.object({
  skill_id: z.string().min(1, 'Skill ID is required'),
  required_level: z.number().int().min(1, 'Required level must be between 1 and 5').max(5, 'Required level must be between 1 and 5'),
  mandatory: z.boolean().optional().default(true),
});
