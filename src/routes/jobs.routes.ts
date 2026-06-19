import { Router } from 'express';
import { getJobStatus } from '../controllers/jobs.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/:id', requireAuth, getJobStatus);

export default router;
