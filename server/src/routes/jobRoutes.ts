import { Router } from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobSkills,
  addOrUpdateJobSkill,
  removeJobSkill,
} from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/')
  .get(getJobs)
  .post(protect, createJob);

router.route('/:id')
  .get(getJobById)
  .put(protect, updateJob)
  .delete(protect, deleteJob);

// Job Required Skill Routes
router.route('/:id/skills')
  .get(getJobSkills)
  .post(protect, addOrUpdateJobSkill);

router.delete('/:id/skills/:skillId', protect, removeJobSkill);

export default router;
