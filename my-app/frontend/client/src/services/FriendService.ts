import { gql, useLazyQuery } from "@apollo/client";

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
