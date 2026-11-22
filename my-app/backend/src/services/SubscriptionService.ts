import { MessageResponseDTO } from "../models/Message";
import { FriendResponseDTO } from "../models/FriendRequest";
import { NotificationPostResponseDTO } from "../models/Notification";
import { UserStatusResponseDTO } from "../models/User";
import { pubsub } from "../config/pubsub";

// 1. PubSub Interface matching graphql-redis-subscriptions
export interface IPubSubEngine {
  publish<T>(triggerName: string, payload: T): Promise<void>;
  asyncIterableIterator<T>(
    triggers: string | string[],
  ): AsyncIterableIterator<T>;
}

// 2. Event Data & Union Payloads
interface SubscriptionData {
  __typename: string;
}

export interface MessageSubscriptionData
  extends MessageResponseDTO, SubscriptionData {}

export interface FriendSubscriptionData
  extends FriendResponseDTO, SubscriptionData {}

export interface NotificationSubscriptionData
  extends NotificationPostResponseDTO, SubscriptionData {}

export interface UserStatusSubscriptionData
  extends UserStatusResponseDTO, SubscriptionData {}

interface SubscriptionBasePayload {
  createdAt: string;
}

export interface MessageEventPayload extends SubscriptionBasePayload {
  action: "MESSAGE_RECEIVED";
  data: MessageSubscriptionData;
}

export interface FriendEventPayload extends SubscriptionBasePayload {
  action: "FRIEND_REQUEST_RECEIVED";
  data: FriendSubscriptionData;
}

export interface NotificationEventPayload extends SubscriptionBasePayload {
  action: "NOTIFICATION_RECEIVED";
  data: NotificationSubscriptionData;
}

export interface UserStatusEventPayload extends SubscriptionBasePayload {
  action: "USER_STATUS";
  data: UserStatusSubscriptionData;
}

// Discriminated union for all events on the USER_${userId} channel
export type UserEventPayload =
  | MessageEventPayload
  | FriendEventPayload
  | NotificationEventPayload
  | UserStatusEventPayload;

// Wrapper matching your GraphQL subscription resolver field ("onEvent")
export interface GraphQLUserEventWrapper {
  onEvent: UserEventPayload;
}

export class SubscriptionService {
  private readonly pubsub: IPubSubEngine;

  constructor(pubsubEngine: IPubSubEngine = pubsub) {
    this.pubsub = pubsubEngine;
  }

  public event(userId: string): AsyncIterableIterator<GraphQLUserEventWrapper> {
    try {
      const iterator =
        this.pubsub.asyncIterableIterator<GraphQLUserEventWrapper>(
          `USER_${userId}`,
        );
      return iterator;
    } catch (error: unknown) {
      console.error("Subscription error:", error);
      throw new Error("❌ Server error");
    }
  }

  public async message(
    userId: string,
    data: MessageResponseDTO,
  ): Promise<MessageEventPayload> {
    try {
      const payload: MessageEventPayload = {
        action: "MESSAGE_RECEIVED",
        createdAt: new Date().toISOString(),
        data: {
          ...data,
          __typename: "MessagePayload",
        },
      };

      await this.pubsub.publish<GraphQLUserEventWrapper>(`USER_${userId}`, {
        onEvent: payload,
      });

      return payload;
    } catch (error: unknown) {
      console.error("Subscription error:", error);
      throw new Error("❌ Server error");
    }
  }

  public async request(
    userId: string,
    data: FriendResponseDTO,
  ): Promise<FriendEventPayload> {
    try {
      const payload: FriendEventPayload = {
        action: "FRIEND_REQUEST_RECEIVED",
        createdAt: new Date().toISOString(),
        data: {
          ...data,
          __typename: "FriendRequestPayload",
        },
      };

      await this.pubsub.publish<GraphQLUserEventWrapper>(`USER_${userId}`, {
        onEvent: payload,
      });

      return payload;
    } catch (error) {
      console.error("Subscription error:", error);
      throw new Error("❌ Server error");
    }
  }

  public async user(userId: string, data: UserStatusResponseDTO) {
    try {
      const payload: UserStatusEventPayload = {
        action: "USER_STATUS",
        createdAt: new Date().toISOString(),
        data: {
          ...data,
          __typename: "User",
        },
      };

      await this.pubsub.publish<GraphQLUserEventWrapper>(
        `USER_${userId}`,
        {
          onEvent: payload,
        },
      );

      return payload;
    } catch (error) {
      console.log("Subscription error:", error);
      throw new Error("❌ Server error");
    }
  }

  public async notify(userId: string, data: NotificationPostResponseDTO) {
    try {
      const payload: NotificationEventPayload = {
        action: "NOTIFICATION_RECEIVED",
        createdAt: new Date().toISOString(),
        data: {
          ...data,
          __typename: "NotificationPayload",
        },
      };

      await this.pubsub.publish<GraphQLUserEventWrapper>(`USER_${userId}`, {
        onEvent: payload,
      });

      return payload;
    } catch (error) {
      console.log("Subscription error:", error);
      throw new Error("❌ Server error");
    }
  }
}
