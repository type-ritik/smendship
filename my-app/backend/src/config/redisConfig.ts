import Redis, { RedisOptions } from "ioredis";

const redisUrl: string = process.env.REDIS_URL || "redis://localhost:6379";

export const baseOptions: RedisOptions = {
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => Math.min(times * 50, 2000), // Auto-reconnect logic
};

export const redisClient = new Redis(redisUrl, baseOptions);
