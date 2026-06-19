import { Request, Response, NextFunction } from 'express';
import { getSupabaseAdmin } from '../lib/supabase';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

/**
 * POST /auth/invite — envia um convite de cadastro por e-mail (admin only).
 *
 * Usa a admin API do Supabase (`inviteUserByEmail`): cria o usuário sem senha e
 * dispara o e-mail com o link mágico, que aponta para `<frontend>/accept-invite`
 * onde o convidado define nome/telefone/CPF/senha. Como é admin, contorna o
 * "signup desabilitado" — exatamente o que queremos num sistema fechado.
 */
export async function inviteUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email } = req.body as { email: string };

    const { error } = await getSupabaseAdmin().auth.admin.inviteUserByEmail(email, {
      redirectTo: `${env.FRONTEND_ORIGIN}/accept-invite`,
    });

    if (error) {
      // E-mail já cadastrado → 409; demais erros viram 400 com a mensagem.
      const alreadyExists =
        error.status === 422 || /already|registered|exists/i.test(error.message);
      throw new AppError(
        alreadyExists ? 'Este e-mail já possui conta ou convite' : error.message,
        alreadyExists ? 409 : 400,
      );
    }

    res.status(200).json({ status: 'ok', invited: email, by: req.user?.email });
  } catch (err) {
    next(err);
  }
}
