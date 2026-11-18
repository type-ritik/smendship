import { gql } from "@apollo/client";

// Following a user == sending a friend request on the backend.
// Variables: { input: { senderId, receiverId, type: "FRIEND_REQUEST_SENT" } }
export const FOLLOW_FRIEND = gql`
  mutation FollowFriend($input: FriendRequestInput) {
    sendFriendRequest(input: $input) {
      id
      senderId
      receiverId
      isAccepted
      requestedAt
    }
  }
`;
