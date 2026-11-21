import Redis, { RedisOptions } from "ioredis";
import "dotenv/config"

const redisUrl: string = process.env.REDIS_URL

if(!redisUrl) {
  throw new Error("FATAL: REDIS_URL environment variable is not defined.");
}

export const baseOptions: RedisOptions = {
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => Math.min(times * 50, 2000), // Auto-reconnect logic
};

export const redisClient = new Redis(redisUrl, baseOptions);
