const { pubsub } = require("../subscription/pubsub");

const sendTextMessage = async (content, chatRoomId, senderId) => {
  try {
    const message = await createMessage(chatRoomId, senderId, content);

    if (!message) {
      throw new Error("Failed to send the message.");
    } else {
      await pubsub.publish(`CHAT_${chatRoomId}`, {
        activeChat: message,
      });
      return message;
    }
  } catch (error) {
    console.log(`[Text Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = {
  sendTextMessage,
};
