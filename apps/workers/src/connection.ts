import { env } from "@moon/shared";
import IORedis from "ioredis";

const redisUrl = env.REDIS_URL;

// Shared connection for queues (producers)
export const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
});

// Factory for worker connections (each worker needs its own connection)
export const createConnection = () =>
  new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
  });

// Close all connections gracefully
export const closeConnection = async () => {
  await connection.quit();
};
