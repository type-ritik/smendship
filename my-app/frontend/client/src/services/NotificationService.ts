import { gql, useQuery } from "@apollo/client";

// Backend: Subscription.onEvent -> LiveEvent { action, createdAt, data: EventPayload }
// EventPayload = MessagePayload | FriendRequestPayload   (Notification is NOT in the union)
export const ON_USER_EVENT = gql`
  subscription OnEvent {
    onEvent {
      action
      createdAt
      data {
        ... on MessagePayload {
          id
          content
          chatRoomId
          createdAt
        }
        ... on FriendRequestPayload {
          id
          senderId
          receiverId
          isAccepted
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
