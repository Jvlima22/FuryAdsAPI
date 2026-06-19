/**
 * Augmenta o tipo Request do Express com o usuário autenticado, populado pelo
 * middleware `requireAuth` após validar o JWT do Supabase.
 */
export type AuthUser = {
  id: string;
  email: string | null;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
