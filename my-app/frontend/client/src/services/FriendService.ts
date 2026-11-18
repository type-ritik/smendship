import { gql, useMutation, useLazyQuery } from "@apollo/client";

// Backend: Query.searchUser(name) -> User  (single user, NOT a list)
export const SEARCH_FRIEND = gql`
  query SearchUser($name: String!) {
    searchUser(name: $name) {
      id
      name
    }
  }
`;

// Backend: Mutation.sendFriendRequest(input: FriendRequestInput) -> FriendRequestPayload
// FriendRequestInput { senderId!, receiverId!, type: REQUEST_TYPE }
export const FRIEND_SEND_REQUEST = gql`
  mutation SendFriendRequest($receiverId: String!) {
    sendFriendRequest(receiverId: $receiverId) {
      response
    }
  }
`;

// Backend: Query.getFollowersCount -> GlobalCount
export const FOLLOWERS_COUNT = gql`
  query GetFollowersCount {
    getFollowersCount {
      count
    }
  }
`;

// Backend: Query.getFollowingsCount -> GlobalCount
export const FOLLOWINGS_COUNT = gql`
  query GetFollowingsCount {
    getFollowingsCount {
      count
    }
  }
`;

export const useFetchFriends = () => {
  const [loadFriend, { loading, error, data }] = useLazyQuery(SEARCH_FRIEND);
  return { loadFriend, loading, error, data };
};

/**
 * Usage:
 *   loadRequest({ variables: { input: { senderId: me.id, receiverId, type: "FRIEND_REQUEST_SENT" } } })
 */
export const useSendFriendRequest = () => {
  const [loadRequest, { loading, error, data }] =
    useMutation(FRIEND_SEND_REQUEST);
  return { loadRequest, loading, error, data };
};
