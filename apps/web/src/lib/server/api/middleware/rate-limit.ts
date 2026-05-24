import type { Context, MiddlewareHandler } from "hono";

interface RateLimitOptions {
  keyGenerator?: (c: Context) => string;
  max: number;
  message?: string;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store - for production with multiple instances, use Redis
const store = new Map<string, RateLimitEntry>();

const defaultKeyGenerator = (c: Context): string =>
  c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "anonymous";

export const rateLimiter = (options: RateLimitOptions): MiddlewareHandler => {
  const {
    windowMs,
    max,
    message = "Too many requests, please try again later",
    keyGenerator = defaultKeyGenerator,
  } = options;

  return async (c, next) => {
    // Clean up expired entries
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetTime) {
        store.delete(key);
      }
    }

    const key = keyGenerator(c);
    const entry = store.get(key);

    if (!entry || now > entry.resetTime) {
      // New window
      store.set(key, { count: 1, resetTime: now + windowMs });
    } else if (entry.count >= max) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      c.header("Retry-After", String(retryAfter));
      c.header("X-RateLimit-Limit", String(max));
      c.header("X-RateLimit-Remaining", "0");
      c.header("X-RateLimit-Reset", String(Math.ceil(entry.resetTime / 1000)));

      return c.json({ success: false, error: message }, 429);
    } else {
      // Increment counter
      entry.count += 1;
    }

    // Set rate limit headers
    const current = store.get(key)!;
    c.header("X-RateLimit-Limit", String(max));
    c.header("X-RateLimit-Remaining", String(Math.max(0, max - current.count)));
    c.header("X-RateLimit-Reset", String(Math.ceil(current.resetTime / 1000)));

    await next();
  };
};
