const { createMessage } = require("../repository/MessageRepository");
const { pubsub } = require("../subscription/pubsub");

const sendTextMessage = async (content, chatRoomId, senderId) => {
  try {
    const message = await createMessage(content, chatRoomId, senderId);

    pubsub.publish(
      `USER_${message.chatRoom.participants[0].user.id === senderId ? message.chatRoom.participants[1].user.id : message.chatRoom.participants[0].user.id}`,
      {
        onUserEvent: {
          action: "NEW_MESSAGE",
          createdAt: message.seenAt,
          data: {
            __typename: "Message",
            id: message.id,
            content: message.content,
            sender: {
              id: message.sender.id,
              name: message.sender.name,
              profile_image: message.sender.profile_image,
            },
            chatRoom: {
              id: message.chatRoom.id,
            },
          },
        },
      },
    );

    return message;
  } catch (error) {
    console.log(`[Text Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = {
  sendTextMessage,
};
