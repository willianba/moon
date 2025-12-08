import type { Handle } from "@sveltejs/kit";
import { app } from "$lib/server/api";

export const handle: Handle = async ({ event, resolve }) => {
  // Handle API routes with Hono
  if (event.url.pathname.startsWith("/api")) {
    const response = await app.fetch(event.request);
    return response;
  }

  // Handle all other routes with SvelteKit
  return resolve(event);
};
