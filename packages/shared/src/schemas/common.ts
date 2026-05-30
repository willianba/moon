// Common schemas
import { z } from "zod";

export const idParamSchema = z.object({
  id: z.ulid(),
});

export type IdParamSchema = z.infer<typeof idParamSchema>;
