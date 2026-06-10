import { Router } from 'express';
import { getCampaignMetrics } from '../controllers/metrics.controller';

const router = Router();

// GET /metrics/google-ads/:customerId?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/:platform/:customerId', getCampaignMetrics);

export default router;
