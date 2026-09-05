import { Router } from 'express';
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentSkills,
  addOrUpdateStudentSkill,
  removeStudentSkill,
} from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';
import skillGapRoutes from './skillGapRoutes.js';

const router = Router();

router.route('/')
  .get(getStudents)
  .post(protect, createStudent);

router.route('/:id')
  .get(getStudentById)
  .put(protect, updateStudent)
  .delete(protect, deleteStudent);

// Student Skill Proficiency Routes
router.route('/:id/skills')
  .get(getStudentSkills)
  .post(protect, addOrUpdateStudentSkill);

router.delete('/:id/skills/:skillId', protect, removeStudentSkill);

// Skill Gap Sub-Routes: /api/students/:studentId/jobs/:jobId/skill-gap & recommendations
router.use('/', skillGapRoutes);

export default router;
