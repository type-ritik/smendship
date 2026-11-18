import { redisClient } from "../config/redisConfig";

class PresenceService {
  constructor() {}

  private USER_ONLINE_PREFIX = "user:online:";
  private redis = redisClient;

  async setUserOnline(userId: string, socketId: string): Promise<void> {
    const key = `${this.USER_ONLINE_PREFIX}${userId}`;

    // Add this unique socket ID to the user's set of active connections
    await this.redis.sadd(key, socketId);

    // Refresh expiration window (e.g., 5 minutes) as a fallback safety measure
    await this.redis.expire(key, 300);
  }

  async setUserOffline(userId: string, socketId: string): Promise<void> {
    const key = `${this.USER_ONLINE_PREFIX}${userId}`;

    // Remove this specific socket ID from their active connections set
    await this.redis.srem(key, socketId);

    // Check if they have any remaining open tabs/sockets left
    const activeConnections = await this.redis.scard(key);

    if (activeConnections === 0) {
      // Completely cleanup the key if no connections remain
      await this.redis.del(key);

      // Optional: Broadcast "User Went Offline" event to a GraphQL Subscription pubsub here
      console.log(`User ${userId} is now completely offline`);
    }
  }
}

// Export a single, live instance of the class (Singleton Pattern)
export const presenceService = new PresenceService();
