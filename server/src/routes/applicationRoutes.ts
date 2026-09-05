import { Router } from 'express';
import {
  ApplicationController,
  createApplicationSchema,
} from '../controllers/applicationController.js';
import { validateRequest } from '../middleware/validate.js';

const router = Router();

router.post(
  '/',
  validateRequest({ body: createApplicationSchema }),
  ApplicationController.createApplication
);
router.get('/', ApplicationController.getApplications);

export default router;
