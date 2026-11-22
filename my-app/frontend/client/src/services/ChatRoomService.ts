import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";

// ---------- Documents (declared first so hooks never touch them before init) ----------

// Backend: Mutation.createChatSpace(receiverId) -> ChatRoomPayload
export const CREATE_CHATROOM = gql`
  mutation CreateChatSpace($receiverId: String!) {
    createChatSpace(receiverId: $receiverId) {
      id
      name
      isGroup
      directKey
    }
  }
`;

// Backend: Query.retriveAllChatRoomsOfUser -> [ParticipantPayload]
export const LIST_OF_PARTICIPANT = gql`
  query RetriveAllChatRoomsOfUser {
    retriveAllChatRoomsOfUser {
      id
      chatRoomId
      role
      lastReadMsgId
      lastReadAt
      joinedAt
    }
  }
`;

export const PARTICIPANT_PROFILE = gql`
  query RetriveUserProfileOfRoom($chatRoomId: String!) {
    retriveUserProfileOfRoom(chatRoomId: $chatRoomId) {
      id
      role
      lastReadAt
      user {
        id
        name
        status
      }
    }
  }
`;

export const LIST_OF_CHAT_FRIENDS = gql`
  query RetriveChatFriends {
    retriveChatFriends {
      id
      isGroup
      directKey
      lastMessageAt
      messages {
        id
        content
        createdAt
      }

      participants {
        id
        role
        lastReadMsgId
        lastReadAt
        joinedAt

        user {
          id
          name
          status
        }
      }
    }
  }
`;

// Backend: Mutation.sendMessage(content, chatRoomId) -> MessagePayload
export const TEXT_MESSAGE = gql`
  mutation SendMessage($chatRoomId: String!, $content: String!) {
    sendMessage(chatRoomId: $chatRoomId, content: $content) {
      id
      content
      chatRoomId
      createdAt
      sender {
        id
        name
      }
    }
  }
`;

// Backend: Query.retriveAllMessagesOfChatSpace(chatRoomId) -> [MessagePayload]
export const CHATROOM_CHATLIST = gql`
  query RetriveAllMessagesOfChatSpace($chatRoomId: String!) {
    retriveAllMessagesOfChatSpace(chatRoomId: $chatRoomId) {
      id
      content
      chatRoomId
      editedAt
      createdAt
      sender {
        id
        name
      }
    }
  }
`;

// Backend: Query.searchUserRoom(name) -> [ParticipantPayload]
export const SEARCH_USER_ROOM = gql`
  query SearchUserRoom($name: String!) {
    searchUserRoom(name: $name) {
      id
      chatRoomId
      role
    }
  }
`;

// ---------- Hooks ----------

export const useChatRoomCreation = () => {
  const [createChatSpace, { loading, data, error }] =
    useMutation(CREATE_CHATROOM);

  return { createChatSpace, loading, data, error };
};

export const useListOfChatRoomParticipant = () => useQuery(LIST_OF_PARTICIPANT);

export const useSendTextMessage = () => {
  const [sendTextMessage, { loading, error, data }] = useMutation(TEXT_MESSAGE);
  return { sendTextMessage, loading, error, data };
};

export const useChatroomChatList = () => {
  const [loadChatList, { loading, data, error }] =
    useLazyQuery(CHATROOM_CHATLIST);
  return { loadChatList, loading, data, error };
};

export const useSearchUserRoom = () => {
  const [searchUserRoom, { loading, data, error }] =
    useLazyQuery(SEARCH_USER_ROOM);
  return { searchUserRoom, loading, data, error };
};

export const useFetchListOfMembersProfile = () =>
  useQuery(LIST_OF_CHAT_FRIENDS);

export const useFetchParticipantProfile = () => {
  const [loadParticipantProfile, { loading, data, error }] =
    useLazyQuery(PARTICIPANT_PROFILE);
  return { loadParticipantProfile, loading, data, error };
};
// REMOVED: GET_ROOM_MEMBER_PROFILE / useFetchMemberProfile
// The backend has no `getRoomMemberProfile` query. Add one to typeDefs + resolvers
// if you need it (see notes).
