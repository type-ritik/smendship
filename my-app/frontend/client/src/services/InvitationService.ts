import { gql, useMutation, useQuery } from "@apollo/client";

export const useFetchListOfFollower = () => {
  return useQuery(LIST_OF_FOLLOWERS);
};

export const useFetchListOfFollowing = () => {
  return useQuery(LIST_OF_FOLLOWINGS);
};

export const useFetchListOfReceivedFriendRequest = () => {
  return useQuery(LIST_OF_RECEIVED_FRIEND_REQUEST);
};

export const useFetchListOfSentFriendRequest = () => {
  return useQuery(LIST_OF_SENT_FRIEND_REQUEST);
};

export const useUpdateFriendRequestResponse = () => {
  const [friendRequestResponse, { loading, data, error }] = useMutation(
    FRIEND_REQUEST_RESPONSE,
  );

  return {
    friendRequestResponse,
    loading,
    data,
    error,
  };
};

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
