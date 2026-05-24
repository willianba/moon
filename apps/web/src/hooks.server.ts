import type { Handle } from "@sveltejs/kit";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 100;
const RATE_LIMIT_MESSAGE = "Too many requests, please try again later";
const rateLimitStore = new Map<string, RateLimitEntry>();

const isApiRequest = (pathname: string) => pathname.startsWith("/api");

const getRequestIp = (request: Request) =>
  request.headers.get("x-forwarded-for") ??
  request.headers.get("x-real-ip") ??
  "anonymous";

const applyCorsHeaders = (response: Response) => {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
};

const createRateLimitResponse = (entry: RateLimitEntry, now: number) => {
  const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

  return applyCorsHeaders(
    Response.json(
      { success: false, error: RATE_LIMIT_MESSAGE },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(entry.resetTime / 1000)),
        },
      }
    )
  );
};

const applyRateLimitHeaders = (response: Response, entry: RateLimitEntry) => {
  response.headers.set("X-RateLimit-Limit", String(RATE_LIMIT_MAX));
  response.headers.set(
    "X-RateLimit-Remaining",
    String(Math.max(0, RATE_LIMIT_MAX - entry.count))
  );
  response.headers.set(
    "X-RateLimit-Reset",
    String(Math.ceil(entry.resetTime / 1000))
  );

  return response;
};

export const handle: Handle = async ({ event, resolve }) => {
  if (!isApiRequest(event.url.pathname)) {
    return resolve(event);
  }

  if (event.request.method === "OPTIONS") {
    return applyCorsHeaders(new Response(null, { status: 204 }));
  }

  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }

  const requestKey = getRequestIp(event.request);
  const existingEntry = rateLimitStore.get(requestKey);

  if (!existingEntry || now > existingEntry.resetTime) {
    rateLimitStore.set(requestKey, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
  } else if (existingEntry.count >= RATE_LIMIT_MAX) {
    return createRateLimitResponse(existingEntry, now);
  } else {
    existingEntry.count += 1;
  }

  const currentEntry = rateLimitStore.get(requestKey)!;
  const response = await resolve(event);

  applyCorsHeaders(response);
  applyRateLimitHeaders(response, currentEntry);

  return response;
};
