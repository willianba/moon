// Main worker entry point - starts all workers

import { closeConnection } from "./connection";
import { emailWorker } from "./workers/email";

console.log("[Jobs] All workers started and listening for jobs...");

// Graceful shutdown handler
const shutdown = async (signal: string) => {
  console.log(`[Jobs] Received ${signal}, shutting down gracefully...`);

  try {
    // Close all workers first (let them finish current jobs)
    await emailWorker.close();
    console.log("[Jobs] Workers closed");

    // Close Redis connections
    await closeConnection();
    console.log("[Jobs] Connections closed");

    process.exit(0);
  } catch (error) {
    console.error("[Jobs] Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
