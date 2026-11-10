import Redis, { RedisOptions } from "ioredis";

export const baseOptions: RedisOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  retryStrategy: (times) => Math.min(times * 50, 2000), // Auto-reconnect logic
};

export const redisClient = new Redis(baseOptions)
