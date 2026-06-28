import { gql, useQuery } from "@apollo/client";

export const NOTIFICATION_SUBSCRIPTION = gql`
  subscription ($userId: String!) {
    iNotified(userId: $userId) {
      id
      type
      fromUserId {
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

export const useRetriveNotification = () => {
  return useQuery(RETRIVE_NOTIFICATION);
}

export const RETRIVE_NOTIFICATION = gql`
  query {
    getNotification {
      id
      type
      fromUserId {
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
