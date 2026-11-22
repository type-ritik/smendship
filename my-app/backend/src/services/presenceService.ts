import { redisClient } from "../config/redisConfig";
import { SubscriptionService } from "./SubscriptionService";

export class PresenceService {
  constructor(private subscriptionService: SubscriptionService) {}

  private USER_ONLINE_PREFIX = "user:online:";
  private WATCHERS_PREFIX = "presence:watchers:";
  private redis = redisClient;

  async setUserOnline(userId: string, socketId: string): Promise<void> {
    const key = `${this.USER_ONLINE_PREFIX}${userId}`;

    // Add this unique socket ID to the user's set of active connections
    await this.redis.sadd(key, socketId);

    // Refresh expiration window 90s with 30s client heartbeat
    await this.redis.expire(key, 90);

    const activeConnections = await this.redis.scard(key);

    if (activeConnections === 1) {
      await this.notifyWatchers(userId, "online");
    }
  }

  async setUserOffline(userId: string, socketId: string): Promise<void> {
    const key = `${this.USER_ONLINE_PREFIX}${userId}`;
    const watchersKey = `presence:watchers:${userId}`;

    await this.redis.smembers(watchersKey);

    // Remove this specific socket ID from their active connections set
    await this.redis.srem(key, socketId);

    // Check if they have any remaining open tabs/sockets left
    const activeConnections = await this.redis.scard(key);

    if (activeConnections === 0) {
      // Completely cleanup the key if no connections remain
      await this.redis.del(key);
      await this.notifyWatchers(userId, "offline");

      // Optional: Broadcast "User Went Offline" event to a GraphQL Subscription pubsub here
      console.log(`User ${userId} is now completely offline`);
    }
  }

  private async notifyWatchers(
    userId: string,
    status: "online" | "offline",
  ): Promise<void> {
    const watcherIds = await this.redis.smembers(
      `${this.WATCHERS_PREFIX}${userId}`,
    );

    if (watcherIds.length === 0) return;

    const onlineStatusMap = await this.getOnlineStatuses(watcherIds);

    await Promise.all(
      watcherIds
        .filter((watcherId) => onlineStatusMap[watcherId])
        .map((watcherId) =>
          this.subscriptionService.user(watcherId, { id: userId, status }),
        ),
    );
  }

  // Check if a single user is online
  async isUserOnline(userId: string): Promise<boolean> {
    const count = await this.redis.scard(`${this.USER_ONLINE_PREFIX}${userId}`);
    return count > 0;
  }

  async setWatcher(targetUserId: string, watcherUserId: string): Promise<void> {
    if (targetUserId === watcherUserId) return;

    // console.log("Data: ", targetUserId, " ", watcherUserId);

    await this.redis.sadd(
      `${this.WATCHERS_PREFIX}${targetUserId}`,
      watcherUserId,
    );
  }

  // Batch check for a list of users (e.g., for a chat sidebar)
  async getOnlineStatuses(userIds: string[]): Promise<Record<string, boolean>> {
    if (userIds.length === 0) return {};

    const pipeline = this.redis.pipeline();
    userIds.forEach((id) => {
      pipeline.scard(`${this.USER_ONLINE_PREFIX}${id}`);
    });

    const results = await pipeline.exec();
    const statusMap: Record<string, boolean> = {};

    userIds.forEach((id, index) => {
      // results[index] is [error, count] in ioredis
      const count = (results?.[index]?.[1] as number) || 0;
      statusMap[id] = count > 0;
    });

    return statusMap;
  }

  async refreshHeartbeat(userId: string, socketId: string): Promise<void> {
    const key = `${this.USER_ONLINE_PREFIX}${userId}`;

    // Add this unique socket ID to the user's set of active connections
    await this.redis.sadd(key, socketId);

    // Refresh expiration window 90s with 30s client heartbeat
    await this.redis.expire(key, 90);
  }
}

// Export a single, live instance of the class (Singleton Pattern)
export const presenceService = new PresenceService(new SubscriptionService());
