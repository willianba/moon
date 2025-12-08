import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  PUBLIC_API_URL: z.string().url(),
});

export type EnvSchema = z.infer<typeof envSchema>;

export const env: EnvSchema = envSchema.parse(process.env);
