import { gql, useQuery, useSubscription } from "@apollo/client";

// Backend: Subscription.onEvent -> LiveEvent { action, createdAt, data: EventPayload }
// EventPayload = MessagePayload | FriendRequestPayload   (Notification is NOT in the union)
export const ON_USER_EVENT = gql`
  subscription OnEvent {
    onEvent {
      action
      createdAt
      data {
        ... on MessagePayload {
          msgId: id
          content
          chatRoomId
          createdAt
          sender {
            id
            name
          }
        }
        ... on FriendRequestPayload {
          fdReqId: id
          senderId
          receiverId
          isAccepted
        }
        ... on User {
          userId: id
          status
        }
      }
    }
  }
`;

// Backend: Query.retriveUserNotifications -> [NotificationPayload]
export const RETRIVE_NOTIFICATION = gql`
  query RetriveUserNotifications {
    retriveUserNotifications {
      id
      type
      fromUserId
      toUserId
      isRead
      notifiedAt
      user1 {
        id
        name
      }
      post {
        id
        title
        content
      }
    }
  }
`;

export const useRetriveNotification = () => useQuery(RETRIVE_NOTIFICATION);

export const useGlobalEvents = () => {
  useSubscription(ON_USER_EVENT, {
    onData: ({ data }) => {
      const event = data.data?.onEvent;

      // console.log(event.action);

      if (!event) return;

      // if (event.action === "USER_STATUS") {
      //   // console.log(`User ${event.id} is now ${event.status}`);
      // }

      // if (event.action === "MESSAGE_RECEIVED") {
      //   // console.log(event);
      // }
    },
  });
};
