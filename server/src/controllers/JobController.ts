import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Job } from '../models/Job.js';
import { JobSkill } from '../models/JobSkill.js';
import { Skill } from '../models/Skill.js';

export const createJobSchema = z.object({
  job_id: z.string().min(1, 'job_id is required'),
  company: z.string().min(1, 'company is required'),
  title: z.string().min(1, 'title is required'),
  location: z.string().min(1, 'location is required'),
});

export const addJobSkillSchema = z.object({
  skill_id: z.string().min(1, 'skill_id is required'),
  required_level: z.number().int().min(1).max(5),
  mandatory: z.boolean().default(true),
});

export class JobController {
  public static async createJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const job = await Job.create(req.body);
      res.status(201).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  public static async getAllJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const jobs = await Job.find().lean();
      res.status(200).json({ success: true, data: jobs });
    } catch (error) {
      next(error);
    }
  }

  public static async getJobById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const job = await Job.findOne({ job_id: id }).lean();
      if (!job) {
        res.status(404).json({ success: false, error: { message: `Job '${id}' not found` } });
        return;
      }

      const skills = await JobSkill.find({ job_id: id }).lean();
      const skillIds = skills.map((s) => s.skill_id);
      const skillEntities = await Skill.find({ skill_id: { $in: skillIds } }).lean();
      const skillMap = new Map(skillEntities.map((s) => [s.skill_id, s]));

      const enrichedSkills = skills.map((s) => ({
        ...s,
        name: skillMap.get(s.skill_id)?.name || s.skill_id,
        category: skillMap.get(s.skill_id)?.category || 'General',
      }));

      res.status(200).json({ success: true, data: { ...job, skills: enrichedSkills } });
    } catch (error) {
      next(error);
    }
  }

  public static async addJobSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { skill_id, required_level, mandatory } = req.body;

      const job = await Job.findOne({ job_id: id });
      if (!job) {
        res.status(404).json({ success: false, error: { message: `Job '${id}' not found` } });
        return;
      }

      const jobSkill = await JobSkill.findOneAndUpdate(
        { job_id: id, skill_id },
        { job_id: id, skill_id, required_level, mandatory },
        { upsert: true, returnDocument: 'after' }
      );

      res.status(200).json({ success: true, data: jobSkill });
    } catch (error) {
      next(error);
    }
  }
}
