// const { pubsub } = require("../subscription/pubsub");
// const { prisma } = require("./data/prisma");
const { verifyToken } = require("../services/JwtServices");

// Context function to provide context to resolvers

const getContext = async ({ req, res }) => {
  const token = req.headers.authorization || null;

  if (!token) {
    return { user: null };
  }

  try {
    const user = verifyToken(token);

    return {
      // prisma, // DB client
      // pubsub, // Redis pub/sub instance
      user, // Current authenticated user
      req,
      res, // Access request/response if needed
    };
  } catch (error) {
    console.error("Error verifying token:", error);
    return { user: null };
  }
};

module.exports = { getContext };
