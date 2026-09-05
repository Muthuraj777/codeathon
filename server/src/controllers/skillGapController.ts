import { Request, Response, NextFunction } from 'express';
import { computeSkillGapAnalysis } from '../services/skillGapEngine.js';
import { Recommendation } from '../models/Recommendation.js';

export const getSkillGapAnalysis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { studentId, jobId } = req.params;

    if (!studentId || !jobId) {
      res.status(400).json({ status: 'fail', message: 'Both studentId and jobId are required parameters.' });
      return;
    }

    const sId = Array.isArray(studentId) ? studentId[0] : studentId;
    const jId = Array.isArray(jobId) ? jobId[0] : jobId;

    const result = await computeSkillGapAnalysis(sId, jId);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const getRecommendations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { studentId, jobId } = req.params;

    const sId = Array.isArray(studentId) ? studentId[0] : studentId;
    const jId = Array.isArray(jobId) ? jobId[0] : jobId;

    const recommendations = await Recommendation.find({
      student_id: sId,
      job_id: jId,
    }).populate('skill_id');

    res.status(200).json({
      status: 'success',
      results: recommendations.length,
      data: {
        recommendations: recommendations.map((rec: any) => ({
          id: rec._id,
          skillId: rec.skill_id?._id || rec.skill_id,
          skillName: rec.skill_id?.name || 'Unknown Skill',
          category: rec.skill_id?.category || 'Other',
          priority: rec.priority,
          currentLevel: rec.current_level,
          targetLevel: rec.target_level,
          reason: rec.reason,
        })),
      },
    });
  } catch (error: any) {
    next(error);
  }
};
