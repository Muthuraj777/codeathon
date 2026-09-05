import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Application } from '../models/Application.js';
import { SkillGapService } from '../services/SkillGapService.js';

export const createApplicationSchema = z.object({
  student_id: z.string().min(1, 'student_id is required'),
  job_id: z.string().min(1, 'job_id is required'),
});

export class ApplicationController {
  public static async createApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { student_id, job_id } = req.body;
      const gapResult = await SkillGapService.analyzeSkillGap(student_id, job_id);

      const application = await Application.create({
        student_id,
        job_id,
        match_percent: gapResult.overallMatchPercent,
        status: 'Applied',
      });

      res.status(201).json({
        success: true,
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const applications = await Application.find().lean();
      res.status(200).json({
        success: true,
        data: applications,
      });
    } catch (error) {
      next(error);
    }
  }
}
