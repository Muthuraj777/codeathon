import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { SkillGapService } from '../services/SkillGapService.js';

export const skillGapParamSchema = z.object({
  studentId: z.string().min(1, 'studentId is required'),
  jobId: z.string().min(1, 'jobId is required'),
});

export class SkillGapController {
  /**
   * GET /api/students/:studentId/jobs/:jobId/skill-gap
   */
  public static async getSkillGap(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = String(req.params.studentId);
      const jobId = String(req.params.jobId);
      const result = await SkillGapService.analyzeSkillGap(studentId, jobId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/students/:studentId/jobs/:jobId/recommendations
   */
  public static async getRecommendations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = String(req.params.studentId);
      const jobId = String(req.params.jobId);
      const result = await SkillGapService.getRecommendations(studentId, jobId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
