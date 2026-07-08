import { gql, useMutation, useQuery } from "@apollo/client";

export const CREATE_CHATROOM = gql`
  mutation ActivateChatRoom($targetUserId: String!) {
    activateChatRoom(targetUserId: $targetUserId) {
      id
    }
  }
`;

export const useChatroomCreation = () => {
  const [activateChatRoom, { loading, data, error }] =
    useMutation(CREATE_CHATROOM);

  return {
    activateChatRoom,
    loading,
    data,
    error,
  };
};

export const useListOfChatRoomParticipant = () => {
  return useQuery(LIST_OF_PARTICIPANT);
};

export const LIST_OF_PARTICIPANT = gql`
  query UserChatRoomId {
    userChatRoomId {
      chatroomId
      participants {
        user {
          id
          name
          status
        }
      }
    }
  }
`;
