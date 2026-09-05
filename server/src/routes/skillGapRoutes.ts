import { Router } from 'express';
import { SkillGapController } from '../controllers/skillGapController.js';

const router = Router({ mergeParams: true });

router.get('/:studentId/jobs/:jobId/skill-gap', SkillGapController.getSkillGap);
router.get('/:studentId/jobs/:jobId/recommendations', SkillGapController.getRecommendations);

export default router;
