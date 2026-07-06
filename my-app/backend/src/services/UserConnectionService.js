const {
  updateUserConnection,
} = require("../repository/UserConnectionRepository");

const updateUserConnectivity = async (userId, isOnline) => {
  try {
    const userStatus = await updateUserConnection(userId, isOnline);

    return userStatus;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  updateUserConnectivity,
};
