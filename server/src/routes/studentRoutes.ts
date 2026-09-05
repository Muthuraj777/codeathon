import { Router } from 'express';
import {
  StudentController,
  createStudentSchema,
  addStudentSkillSchema,
} from '../controllers/StudentController.js';
import { validateRequest } from '../middleware/validate.js';
import skillGapRoutes from './skillGapRoutes.js';

const router = Router();

router.post('/', validateRequest({ body: createStudentSchema }), StudentController.createStudent);
router.get('/', StudentController.getAllStudents);
router.get('/:id/skills', StudentController.getStudentSkills);
router.post(
  '/:id/skills',
  validateRequest({ body: addStudentSkillSchema }),
  StudentController.addOrUpdateSkill
);

// Mount skill-gap routes under /api/students
router.use('/', skillGapRoutes);

export default router;
