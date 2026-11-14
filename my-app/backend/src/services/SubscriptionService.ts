import { RedisPubSub } from "graphql-redis-subscriptions";
import { MessageResponseDTO } from "../models/Message";
import { FriendResponseDTO } from "../models/FriendRequest";

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

// Discriminated union for all events on the USER_${userId} channel
export type UserEventPayload = MessageEventPayload | FriendEventPayload;

// Wrapper matching your GraphQL subscription resolver field ("onEvent")
export interface GraphQLUserEventWrapper {
  onEvent: UserEventPayload;
}

export class SubscriptionService {
  constructor(private pubsub: IPubSubEngine) {}

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
}
