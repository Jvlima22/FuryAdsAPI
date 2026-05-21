import { Router } from 'express';
import webhookRoutes from './webhook.routes';
import jobsRoutes from './jobs.routes';

const router = Router();

router.use('/webhook', webhookRoutes);
router.use('/jobs', jobsRoutes);

export default router;
