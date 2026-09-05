import { Router } from 'express';
import { SkillGapController, skillGapParamSchema } from '../controllers/SkillGapController.js';
import { validateRequest } from '../middleware/validate.js';

const router = Router();

/**
 * @route   GET /api/students/:studentId/jobs/:jobId/skill-gap
 * @desc    Analyze skill gap between a student and a job
 */
router.get(
  '/:studentId/jobs/:jobId/skill-gap',
  validateRequest({ params: skillGapParamSchema }),
  SkillGapController.getSkillGap
);

/**
 * @route   GET /api/students/:studentId/jobs/:jobId/recommendations
 * @desc    Get prioritized learning recommendations for gaps
 */
router.get(
  '/:studentId/jobs/:jobId/recommendations',
  validateRequest({ params: skillGapParamSchema }),
  SkillGapController.getRecommendations
);

export default router;
