import { gql, useMutation, useQuery } from "@apollo/client";
// import { useSelector } from "react-redux";
// import type {
//   InvitationRequestInterface,
//   // UserObjState,
// } from "../utils/userInterfaces";

// ---------------------------------------------------------------------------
// BACKEND CHANGE REQUIRED: FriendRequestPayload currently has only senderId /
// receiverId, so the UI cannot show who a request is from. Add to typeDefs:
//
//   type FriendRequestPayload {
//     ...existing fields
//     sender: User
//     receiver: User
//   }
//
// plus field resolvers (FriendRequestPayload.sender / .receiver) that load the
// user by senderId / receiverId.
// ---------------------------------------------------------------------------

// Assumption: in FriendshipPayload, `followers` is the user who follows and
// `followings` is the user being followed.
export const LIST_OF_FOLLOWERS = gql`
  query GetListOfFollowers {
    getListOfFollowers {
      id
      follower
      following
      followers {
        id
        name
      }
      createdAt
    }
  }
`;

export const LIST_OF_FOLLOWINGS = gql`
  query GetListOfFollowings {
    getListOfFollowings {
      id
      follower
      following
      followings {
        id
        name
      }
      createdAt
    }
  }
`;

export const LIST_OF_FRIEND_REQUESTS = gql`
  query GetFriendRequestsListOfUser {
    getFriendRequestsListOfUser {
      id
      senderId
      isAccepted
      requestedAt
      sender {
        id
        name
        status
      }
    }
  }
`;

export const LIST_OF_SENT_FRIEND_REQUESTS = gql`
  query GetSentFriendRequestListOfUser {
    getSentFriendRequestListOfUser {
      id
      receiverId
      isAccepted
      requestedAt
      receiver {
        id
        name
        status
      }
    }
  }
`;

export const FRIEND_REQUEST_RESPONSE = gql`
  mutation ResolveFriendRequest($requestId: String!, $response: Boolean!) {
    resolveFriendRequest(requestId: $requestId, response: $response) {
      response
    }
  }
`;

// type BasicUser = { id: string; name: string } | null | undefined;

// type FriendshipRow = {
//   id: string;
//   follower?: string | null;
//   following?: string | null;
//   followers?: BasicUser;
//   followings?: BasicUser;
//   createdAt?: string | null;
// };

// type FriendRequestRow = {
//   id: string;
//   senderId: string;
//   receiverId: string | null;
//   isAccepted: boolean | null;
//   requestedAt?: string | null;
//   sender?: BasicUser;
//   receiver?: BasicUser | null;
// };

// const unknownUser = (id?: string | null) => ({
//   id: id ?? "",
//   name: "Unknown user",
// });

// const useCurrentUserId = () =>
// useSelector((s: UserObjState) => s.user.currentUser?.user.id);

// All hooks below return { data: InvitationRequestInterface[], loading, error, refetch }
export const useFetchListOfFollower = () => {
  const { data, loading, error, refetch } = useQuery(LIST_OF_FOLLOWERS);

  const followerData = data?.getListOfFollowers;

  return { data: followerData, loading, error, refetch };
};

export const useFetchListOfFollowing = () => {
  const { data, loading, error, refetch } = useQuery(LIST_OF_FOLLOWINGS);

  const followingData = data?.getListOfFollowings;

  return { data: followingData, loading, error, refetch };
};

// Assumption: isAccepted === null/undefined means "still pending".
// const isPending = (r: FriendRequestRow) => r.isAccepted == null;

export const useFetchListOfReceivedFriendRequest = () => {
  const { data, loading, error, refetch } = useQuery(LIST_OF_FRIEND_REQUESTS);
  return { data, loading, error, refetch };
};

export const useFetchListOfSentFriendRequest = () => {
  const { data, loading, error, refetch } = useQuery(
    LIST_OF_SENT_FRIEND_REQUESTS,
  );
  return { data, loading, error, refetch };
};

/** Usage: friendRequestResponse({ variables: { requestId, response: true } }) */
export const useUpdateFriendRequestResponse = () => {
  const [friendRequestResponse, { loading, data, error }] = useMutation(
    FRIEND_REQUEST_RESPONSE,
  );
  return { friendRequestResponse, loading, data, error };
};
