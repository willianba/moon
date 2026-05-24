import { db, sql } from "@moon/database";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const checks: Record<string, "error" | "ok"> = {};
  let healthy = true;

  try {
    await db.execute(sql`SELECT 1`);
    checks.database = "ok";
  } catch {
    checks.database = "error";
    healthy = false;
  }

  return {
    health: {
      checks,
      status: healthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
    },
  };
};
