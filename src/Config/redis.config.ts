import { Redis } from "ioredis";
import chalk from "chalk";
import { REDIS_URL } from "./env.config.js";

let redisClient: Redis | null = null;
let isConnected = false;

try {
  redisClient = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    retryStrategy(times) {
      if (times > 5) {
        console.warn(chalk.yellow("⚠️ Redis connection retries exhausted. Running backend in fallback mode (no cache)."));
        return null; // Stop retrying
      }
      return Math.min(times * 500, 2000);
    },
  });

  redisClient.on("connect", () => {
    isConnected = true;
    console.log(chalk.green("🔴 Connected to Redis Server successfully!"));
  });

  redisClient.on("error", (err) => {
    isConnected = false;
    console.warn(chalk.yellow("Redis Warning (continuing without cache):"), err.message || err);
  });

  // Attempt initial async connection
  redisClient.connect().catch((err) => {
    isConnected = false;
    console.warn(chalk.yellow("Redis initial connection warning (continuing without cache):"), err.message || err);
  });
} catch (err: any) {
  console.warn(chalk.yellow("Failed to initialize Redis client:"), err.message || err);
}

/**
 * Safely retrieves cached data from Redis. Returns null if Redis is offline or key not found.
 */
export const getCache = async (key: string): Promise<string | null> => {
  if (!redisClient || !isConnected) return null;
  try {
    return await redisClient.get(key);
  } catch (err) {
    return null;
  }
};

/**
 * Safely sets cached data in Redis with a TTL in seconds. Does nothing if Redis is offline.
 */
export const setCache = async (key: string, value: string, ttlSeconds: number): Promise<void> => {
  if (!redisClient || !isConnected) return;
  try {
    await redisClient.setex(key, ttlSeconds, value);
  } catch (err) {
    // Ignore cache set errors silently
  }
};

export { redisClient };
