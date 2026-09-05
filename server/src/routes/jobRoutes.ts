import { Router } from 'express';
import { JobController, createJobSchema, addJobSkillSchema } from '../controllers/JobController.js';
import { validateRequest } from '../middleware/validate.js';

const router = Router();

router.post('/', validateRequest({ body: createJobSchema }), JobController.createJob);
router.get('/', JobController.getAllJobs);
router.get('/:id', JobController.getJobById);
router.post('/:id/skills', validateRequest({ body: addJobSkillSchema }), JobController.addJobSkills);

export default router;
