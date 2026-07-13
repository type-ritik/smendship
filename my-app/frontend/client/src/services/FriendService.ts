import { gql, useMutation, useLazyQuery } from "@apollo/client";

export const useFetchFriends = () => {
  const [loadFriend, { loading, error, data }] = useLazyQuery(SEARCH_FRIEND);
  return {
    loadFriend,
    loading,
    error,
    data,
  };
};

export const SEARCH_FRIEND = gql`
  query SearchFriends($friendName: String!) {
    searchFriends(friendName: $friendName) {
      id
      name
      status
    }
  }
`;

export const useSendFriendRequest = () => {
  const [loadRequest, { loading, error, data }] =
    useMutation(FRIEND_SEND_REQUEST);

  return {
    loadRequest,
    loading,
    error,
    data,
  };
};

export const FRIEND_SEND_REQUEST = gql`
  mutation FriendSendRequest($receiverId: String!) {
    friendSendRequest(receiverId: $receiverId) {
      message
      response
    }
  }
`;
