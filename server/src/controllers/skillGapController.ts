import { Request, Response, NextFunction } from 'express';
import { SkillGapService } from '../services/SkillGapService.js';

export const getSkillGapAnalysis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const studentId = String(req.params.studentId);
    const jobId = String(req.params.jobId);
    const result = await SkillGapService.analyzeSkillGap(studentId, jobId);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const studentId = String(req.params.studentId);
    const jobId = String(req.params.jobId);
    const result = await SkillGapService.getRecommendations(studentId, jobId);

    res.status(200).json({
      status: 'success',
      data: { recommendations: result },
    });
  } catch (error) {
    next(error);
  }
};

export class SkillGapController {
  public static getSkillGap = getSkillGapAnalysis;
  public static getRecommendations = getRecommendations;
}
