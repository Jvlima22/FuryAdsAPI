import { Router } from 'express';
import webhookRoutes from './webhook.routes';
import jobsRoutes from './jobs.routes';
import metricsRoutes from './metrics.routes';

const router = Router();

router.use('/webhook', webhookRoutes);
router.use('/jobs', jobsRoutes);
router.use('/metrics', metricsRoutes);

export default router;
