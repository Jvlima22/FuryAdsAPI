import { z } from 'zod';

export const violationTypeSchema = z.enum([
  'PROHIBITED_TERM',
  'BRAND_VIOLATION',
  'COMPLIANCE_FAIL',
]);

export const severitySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

export const violationPayloadSchema = z.object({
  adId: z.string().min(1, 'adId é obrigatório'),
  tenantId: z.string().min(1, 'tenantId é obrigatório'),
  violationType: violationTypeSchema,
  severity: severitySchema,
  detectedAt: z.iso.datetime(),
});

export type ViolationPayload = z.infer<typeof violationPayloadSchema>;
export type ViolationType = z.infer<typeof violationTypeSchema>;
export type Severity = z.infer<typeof severitySchema>;
