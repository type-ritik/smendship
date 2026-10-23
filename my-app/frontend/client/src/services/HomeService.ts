import { gql } from "@apollo/client";

export const FOLLOW_FRIEND = gql`
  mutation FriendSendRequest($receiverId: String!) {
    friendSendRequest(receiverId: $receiverId) {
      message
      response
    }
  }
`;
