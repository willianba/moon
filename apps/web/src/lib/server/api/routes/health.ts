import { Hono } from "hono";
import { db, sql } from "@moon/database";

export const healthRoute = new Hono()
  .get("/", async (c) => {
    const checks: Record<string, "ok" | "error"> = {};
    let healthy = true;

    // Database health check
    try {
      await db.execute(sql`SELECT 1`);
      checks.database = "ok";
    } catch {
      checks.database = "error";
      healthy = false;
    }

    return c.json(
      {
        status: healthy ? "ok" : "degraded",
        timestamp: new Date().toISOString(),
        checks,
      },
      healthy ? 200 : 503,
    );
  })
  // Simple liveness probe (no dependencies check)
  .get("/live", (c) => {
    return c.json({ status: "ok" });
  });
