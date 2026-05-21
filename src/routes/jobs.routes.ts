import { Router } from 'express';
import { getJobStatus } from '../controllers/jobs.controller';

const router = Router();

router.get('/:id', getJobStatus);

export default router;
