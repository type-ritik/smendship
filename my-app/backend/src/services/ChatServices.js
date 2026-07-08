const {
  findChatRoomByTargetUserId,
  createChatRoom,
  getAllParticipantsByUserId,
  getAllChatroomChatListByUserIdAndChatroomId,
  createParticipants,
} = require("../repository/ChatRoomRepository");

const chatRoomActivate = async (userId, targetUserId) => {
  try {
    let room = await findChatRoomByTargetUserId(targetUserId);

    if (!room) {
      room = await createChatRoom();
    } else {
      return room;
    }

    await createParticipants(userId, "creator", room);
    await createParticipants(targetUserId, "member", room);

    return {
      id: room,
    };
  } catch (error) {
    console.log(`[Chat Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const retriveAllParticipantsList = async (userId) => {
  try {
    const payload = await getAllParticipantsByUserId(userId);

    if (!payload) {
      throw new Error("Failed to retrieve participants list.");
    }

    const members = payload.map((item) => {
      const otherParticipant = item.chatRoom.participants.find(
        (member) => member.user.id !== userId,
      );

      return {
        chatroomId: item.chatRoomId,
        participants: otherParticipant ? otherParticipant : null,
      };
    });

    return members;
  } catch (error) {
    console.log(`[Chat Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const retriveAllChatroomChatList = async (chatroomId, userId) => {
  try {
    const payload = await getAllChatroomChatListByUserIdAndChatroomId(
      chatRoomActivate,
      userId,
    );

    if (!payload) {
      throw new Error("Failed to retrieve chat list.");
    }

    return payload;
  } catch (error) {
    console.log(`[Chat Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = {
  chatRoomActivate,
  retriveAllParticipantsList,
  retriveAllChatroomChatList,
};
