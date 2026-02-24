// import Redis from "ioredis";

// const subscriber = new Redis();

// // export const publishMessage = async (chatRoomId, message) => {
// //   const payload = JSON.stringify(message);
// //   await redis.publish(`CHAT_${chatRoomId}`, payload);
// // };

// export const subscribeToChat = (chatRoomId, callback) => {
//   subscriber.subscribe(`CHAT_${chatRoomId}`);

//   subscriber.on("message", (channel, message) => {
//     if (channel === `CHAT_${chatRoomId}`) {
//       const data = JSON.parse(message);
//       console.log("new chat ", data);
//       callback(data);
//     }
//   });
// };

// // export const publishNotification = async (toUserId, message) => {
// //   const payload = JSON.stringify(message);
// //   await redis.publish(`NOTIFICATION_${toUserId}`, payload);
// // }

// export const subscribeToNotify = (userId, callback) => {
//   console.log("Before subscribe");
//   subscriber.subscribe(`notify:${userId}`);
//   console.log("after")

//   subscriber.on("message", (channel, message) => {
//     if (channel === `notify:${userId}`) {
//       data = JSON.parse(message);
//       console.log("Notified user: ", data);
//       callback(data);
//     }
//   });
// };
