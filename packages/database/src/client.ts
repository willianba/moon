import { env } from "@moon/shared";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index";

const connectionString = env.DATABASE_URL;

// For query purposes
const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });

// For migrations (uses a separate connection with max 1)
export const createMigrationClient = () => {
  const migrationClient = postgres(connectionString, { max: 1 });
  return drizzle(migrationClient, { schema });
};

export type Database = typeof db;
