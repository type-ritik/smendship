const { prisma } = require("../config/prismaConfig");

const updateUserConnection = async (userId, isOnline) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: isOnline ? "online" : "offline",
      },
      select: {
        id: true,
        status: true,
      },
    });

    return user.status;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { updateUserConnection };
