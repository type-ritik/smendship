import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";

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

export const GET_ROOM_MEMBER_PROFILE = gql`
  query GetRoomMemberProfile($chatRoomId: String!) {
    getRoomMemberProfile(chatRoomId: $chatRoomId) {
      id
      user {
        id
        name
        status
        profile_image
      }
    }
  }
`;

export const useFetchMemberProfile = () => {
  const [loadMemberProfile, { called, loading, data }] = useLazyQuery(
    GET_ROOM_MEMBER_PROFILE,
  );

  return {
    loadMemberProfile,
    called,
    loading,
    data,
  };
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

export const useSendTextMessage = () => {
  const [sendTextMessage, { loading, error, data }] = useMutation(TEXT_MESSAGE);
  return {
    sendTextMessage,
    loading,
    error,
    data,
  };
};

export const TEXT_MESSAGE = gql`
  mutation TextMessage($chatRoomId: String!, $content: String!) {
    textMessage(chatRoomId: $chatRoomId, content: $content) {
      id
      content
      sender {
        id
        name
        profile_image
      }
      chatRoom {
        id
      }
    }
  }
`;
