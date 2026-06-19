import { Router } from 'express';
import { getCampaignMetrics } from '../controllers/metrics.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// GET /metrics/google-ads/:customerId?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/:platform/:customerId', requireAuth, getCampaignMetrics);

export default router;
