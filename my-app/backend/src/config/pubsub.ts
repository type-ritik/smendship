import { RedisPubSub } from "graphql-redis-subscriptions";
import { baseOptions, redisUrl } from "./redisConfig";
import Redis from "ioredis";

// 2. Dynamically inject the TLS block if running on Upstash
if (redisUrl.includes("upstash.io")) {
  baseOptions.tls = {
    rejectUnauthorized: false, // Allows connection via secure Upstash endpoints
  };
}

// 3. Create two brand-new, isolated connections exclusively for the Pub/Sub framework
const pubClient = new Redis(redisUrl, baseOptions);
const subClient = new Redis(redisUrl, baseOptions);

// 4. Instantiate the single global GraphQL PubSub engine
export const pubsub = new RedisPubSub({
  publisher: pubClient as any,
  subscriber: subClient as any,
});
