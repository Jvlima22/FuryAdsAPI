import { Request, Response, NextFunction } from 'express';
import { takedownQueue } from '../queues/takedown.queue';
import { AppError } from '../utils/AppError';

export async function getJobStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const jobId = String(req.params.id);
    const job = await takedownQueue.getJob(jobId);

    if (!job) {
      throw new AppError('Job não encontrado', 404);
    }

    const state = await job.getState();

    res.json({
      jobId: job.id,
      status: state,
      attempts: job.attemptsMade,
      result: job.returnvalue ?? null,
      error: job.failedReason ?? null,
    });
  } catch (err) {
    next(err);
  }
}
