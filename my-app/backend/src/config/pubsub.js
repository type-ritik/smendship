const { PubSub } = require("graphql-subscriptions");
const pubSub = new PubSub();

const FRIEND_REQUEST_SENT = "FRIEND_REQUEST_SENT";
const FRIEND_REQUEST_ACCEPTED = "FRIEND_REQUEST_ACCEPTED";

module.exports = {
  pubSub,
  FRIEND_REQUEST_SENT,
  FRIEND_REQUEST_ACCEPTED,
};
