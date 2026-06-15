import { gql } from "@apollo/client";

export const LIST_OF_FOLLOWERS = gql`
  query ListOfFollowers {
    listOfFollowers {
      id
      user {
        id
        name
      }
      createdAt
    }
  }
`;

export const LIST_OF_FOLLOWINGS = gql`
  query ListOfFollowing {
    listOfFollowings {
      id
      user {
        id
        name
      }
      createdAt
    }
  }
`;

export const LIST_OF_RECEIVED_FRIEND_REQUEST = gql`
  query ListOfReceivedFriendRequest {
    listOfReceivedFriendRequest {
      id
      user {
        id
        name
      }
      createdAt
    }
  }
`;

export const LIST_OF_SENT_FRIEND_REQUEST = gql`
  query ListOfSentFriendRequest {
    listOfSentFriendRequest {
      id
      user {
        id
        name
      }
      createdAt
    }
  }
`;

export const FRIEND_REQUEST_RESPONSE = gql`
  mutation FriendRequestResponse($requestId: String!, $responseCode: String!) {
    friendRequestResponse(requestId: $requestId, responseCode: $responseCode) {
      message
      response
    }
  }
`;
