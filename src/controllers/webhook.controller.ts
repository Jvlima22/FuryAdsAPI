import { Request, Response, NextFunction } from 'express';
import {
  buildTakedownJobId,
  takedownQueue,
} from '../queues/takedown.queue';
import { acquireLock, releaseLock } from '../queues/idempotency';
import { ViolationPayload } from '../schemas/violation.schema';

export async function handleViolationWebhook(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const payload = req.body as ViolationPayload;
    const jobId = buildTakedownJobId(payload.tenantId, payload.adId);

    // Lock atômico SET NX no Redis — garante que duas requests concorrentes
    // com mesmo tenantId+adId só passem uma adiante.
    const acquired = await acquireLock(jobId);
    if (!acquired) {
      const existing = await takedownQueue.getJob(jobId);
      const state = existing ? await existing.getState() : 'unknown';
      res.status(409).json({
        status: 'duplicate',
        message: 'Já existe um job em andamento para este tenantId+adId',
        jobId,
        state,
      });
      return;
    }

    try {
      // Limpa instância antiga (completed/failed) com mesmo ID antes de reenfileirar.
      const stale = await takedownQueue.getJob(jobId);
      if (stale) {
        await stale.remove();
      }
      const job = await takedownQueue.add('takedown', payload, { jobId });
      res.status(202).json({ status: 'enqueued', jobId: job.id });
    } catch (err) {
      // Se falhou ao enfileirar, libera o lock para não travar o ID.
      await releaseLock(jobId);
      throw err;
    }
  } catch (err) {
    next(err);
  }
}
