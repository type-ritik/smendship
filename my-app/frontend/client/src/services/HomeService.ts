import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query GetPosts {
    getPosts {
      id
      title
      content
      author {
        id
        name
      }
    }
  }
`;

export const FOLLOW_FRIEND = gql`
  mutation FriendSendRequest($receiverId: String!) {
    friendSendRequest(receiverId: $receiverId) {
      message
      response
    }
  }
`;
