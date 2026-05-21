import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      status: 'error',
      message: 'Dados inválidos',
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  console.error('Erro inesperado:', err);
  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor',
  });
}