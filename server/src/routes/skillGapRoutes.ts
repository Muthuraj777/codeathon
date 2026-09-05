import { Router } from 'express';
import { SkillGapController, skillGapParamSchema } from '../controllers/SkillGapController.js';
import { validateRequest } from '../middleware/validate.js';

const router = Router();

router.get(
  '/:studentId/jobs/:jobId/skill-gap',
  validateRequest({ params: skillGapParamSchema }),
  SkillGapController.getSkillGap
);

router.get(
  '/:studentId/jobs/:jobId/recommendations',
  validateRequest({ params: skillGapParamSchema }),
  SkillGapController.getRecommendations
);

export default router;
