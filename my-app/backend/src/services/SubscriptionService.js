const { pubsub } = require("../subscription/pubsub");

const userEventSubs = (userId) => {
  try {
    const payload = pubsub.asyncIterableIterator(`USER_${userId}`);

    return payload;
  } catch (error) {
    console.log(`[Subscription Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = {
  userEventSubs,
};
