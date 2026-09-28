import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().default('file:./dev.db'),
  JWT_SECRET: z.string().default('dev-secret-change-me'),
  NEXT_PUBLIC_APP_URL: z.string().default('http://localhost:3000'),
});

export const env = envSchema.parse(process.env);
