import { Router } from 'express';
import { inviteUser } from '../controllers/auth.controller';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { inviteSchema } from '../schemas/auth.schema';

const router = Router();

// POST /auth/invite — só admins (allowlist) autenticados.
router.post('/invite', requireAuth, requireAdmin, validate(inviteSchema), inviteUser);

export default router;
