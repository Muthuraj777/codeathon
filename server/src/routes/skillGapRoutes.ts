import { Router } from 'express';
import { getSkillGapAnalysis, getRecommendations } from '../controllers/skillGapController.js';

const router = Router({ mergeParams: true });

router.get('/:studentId/jobs/:jobId/skill-gap', getSkillGapAnalysis);
router.get('/:studentId/jobs/:jobId/recommendations', getRecommendations);

export default router;
