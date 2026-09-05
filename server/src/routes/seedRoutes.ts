import { Router } from 'express';
import { SeedController } from '../controllers/SeedController.js';

const router = Router();

router.post('/', SeedController.seedDemoData);
router.get('/', SeedController.seedDemoData);

export default router;
