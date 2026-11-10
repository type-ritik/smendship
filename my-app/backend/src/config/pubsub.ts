import { RedisPubSub } from "graphql-redis-subscriptions";
import { baseOptions } from "./redisConfig";
import Redis from "ioredis";

// 1. Fallback to an empty string so '.includes()' never crashes on undefined env vars
const redisUrl = process.env.REDIS_HOST || "";

// 2. Dynamically inject the TLS block if running on Upstash
if (redisUrl.includes("upstash.io")) {
  baseOptions.tls = {
    rejectUnauthorized: false, // Allows connection via secure Upstash endpoints
  };
}

// 3. Create two brand-new, isolated connections exclusively for the Pub/Sub framework
const pubClient = new Redis(baseOptions);
const subClient = new Redis(baseOptions);

// 4. Instantiate the single global GraphQL PubSub engine
export const pubsub = new RedisPubSub({
  publisher: pubClient as any,
  subscriber: subClient as any,
});
