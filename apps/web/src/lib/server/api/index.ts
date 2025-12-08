import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { rateLimiter } from "./middleware";
import { usersRoute, healthRoute, jobsRoute } from "./routes/index";

// Create the main Hono app
const app = new Hono().basePath("/api");

// Global error handler - prevents stack traces from leaking
app.onError((err, c) => {
  console.error("[API Error]", err);

  if (err instanceof HTTPException) {
    return c.json({ success: false, error: err.message }, err.status);
  }

  // Don't expose internal error details in production
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message;

  return c.json({ success: false, error: message }, 500);
});

// Handle 404s
app.notFound((c) => {
  return c.json({ success: false, error: "Not found" }, 404);
});

// Global middleware
app.use("*", logger());
app.use("*", cors());

// Rate limiting: 100 requests per minute per IP
app.use(
  "*",
  rateLimiter({
    windowMs: 60 * 1000,
    max: 100,
  }),
);

// Mount routes
const routes = app
  .route("/health", healthRoute)
  .route("/users", usersRoute)
  .route("/jobs", jobsRoute);

// Export the app and type for RPC client
export type AppType = typeof routes;
export { app };
