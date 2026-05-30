import { z } from "zod";

export const envSchema = z.object({
  REDIS_URL: z.url(),
  TURSO_DATABASE_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string().optional(),
});

export type EnvSchema = z.infer<typeof envSchema>;

let _parsed: EnvSchema | null = null;

const getEnv = (): EnvSchema => {
  if (!_parsed) {
    _parsed = envSchema.parse(process.env);
  }
  return _parsed;
};

export const env: EnvSchema = new Proxy({} as EnvSchema, {
  get(_, prop: string) {
    return getEnv()[prop as keyof EnvSchema];
  },
});
