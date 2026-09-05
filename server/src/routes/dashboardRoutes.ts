import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController.js';

const router = Router();

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get executive dashboard KPIs and top skill gap analytics
 */
router.get('/stats', DashboardController.getStats);

export default router;
