import { Router } from 'express';
import { handleViolationWebhook } from '../controllers/webhook.controller';
import { validate } from '../middlewares/validate.middleware';
import { violationPayloadSchema } from '../schemas/violation.schema';

const router = Router();

router.post(
  '/violation',
  validate(violationPayloadSchema, 'body'),
  handleViolationWebhook,
);

export default router;
