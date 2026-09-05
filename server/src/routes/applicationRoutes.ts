import { Router } from 'express';
import {
  ApplicationController,
  createApplicationSchema,
  updateStatusSchema,
} from '../controllers/applicationController.js';
import { validateRequest } from '../middleware/validate.js';

const router = Router();

router.post(
  '/',
  validateRequest({ body: createApplicationSchema }),
  ApplicationController.createApplication
);

router.get('/', ApplicationController.getApplications);
router.get('/:id', ApplicationController.getApplicationById);

router.patch(
  '/:id/status',
  validateRequest({ body: updateStatusSchema }),
  ApplicationController.updateStatus
);

router.put(
  '/:id/status',
  validateRequest({ body: updateStatusSchema }),
  ApplicationController.updateStatus
);

export default router;
