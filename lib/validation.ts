import { z } from 'zod';

export const currentOrganizationPatchSchema = z.object({
  name: z.string().min(2).optional(),
  industry: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  preferredLanguage: z.enum(['en', 'hi']).optional(),
});
