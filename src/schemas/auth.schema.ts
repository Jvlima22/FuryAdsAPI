import { z } from 'zod';

export const inviteSchema = z.object({
  email: z.string().email('E-mail inválido').transform((e) => e.trim().toLowerCase()),
});

export type InvitePayload = z.infer<typeof inviteSchema>;
