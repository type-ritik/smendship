const { RedisPubSub } = require("graphql-redis-subscriptions");
const Redis = require("ioredis");

// 1. Extract the URL string cleanly
const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

// 2. Set up base configurations
const baseOptions = {
  maxRetriesPerRequest: null, // Required for PubSub and message streams
  retryStrategy(times) {
    console.warn(`Retrying Redis connection: attempt ${times}`);
    return Math.min(times * 50, 2000);
  },
};

// 3. Dynamically inject the TLS block if running on Upstash
if (redisUrl.includes("upstash.io")) {
  baseOptions.tls = {
    rejectUnauthorized: false, // Allows connection via secure Upstash endpoints
  };
}

// 4. Instantiate clients by passing the URL first, then the configurations object
const redisClient = new Redis(redisUrl, baseOptions);

const pubsub = new RedisPubSub({
  publisher: new Redis(redisUrl, baseOptions),
  subscriber: new Redis(redisUrl, baseOptions),
});

// 5. Add event handlers to catch errors and confirm active links
redisClient.on("connect", () => console.log("✅ Redis main client connected successfully!"));
redisClient.on("error", (err) => console.error("❌ Redis main client error:", err.message));

module.exports = { pubsub, redisClient };
