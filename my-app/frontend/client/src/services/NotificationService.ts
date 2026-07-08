import { gql, useQuery } from "@apollo/client";

export const ON_USER_EVENT = gql`
  subscription {
    onUserEvent {
      action
      createdAt
      data {
        # If the backend returns a message type
        ... on Message {
          id
          content
          sender {
            id
            name
          }
          chatRoom {
            id
          }
        }
        # If the backend returns a FriendRequest type
        ... on FriendRequest {
          id
          sender {
            id
            name
          }
          receiver {
            id
            name
          }
          isAccepted
        }
        # If the backend returns a Notification type
        ... on Notification {
          id
          type
          isRead
          notifiedAt
          fromUser {
            id
          }
        }
      }
    }
  }
`;

export const useRetriveNotification = () => {
  return useQuery(RETRIVE_NOTIFICATION);
};

export const RETRIVE_NOTIFICATION = gql`
  query {
    getNotification {
      id
      type
      fromUser {
        id
        name
      }
      post {
        id
        content
      }
      isRead
      notifiedAt
    }
  }
`;
