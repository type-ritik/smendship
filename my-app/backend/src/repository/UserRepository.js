const { prisma } = require("../config/prismaConfig");

async function createUser(name, email, password, verificationCode, codeExpiry) {
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
        verificationCode,
        codeExpiry,
        is_activated: false,
      },
    });

    return newUser;
  } catch (error) {
    console.log(`[User Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

async function deactivateUserById(id) {
  try {
    const deactivatedUser = await prisma.user.update({
      where: { id },
      data: {
        is_activated: false,
      },
    });

    return !!deactivateUserById;
  } catch (error) {
    console.log(`[User Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

async function getUserById(id) {
  try {
    const user = await prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.log(`[User Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

async function getUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        is_activated: true,
        verificationCode: true,
        codeExpiry: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.log(`[User Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

async function existsUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return !!user;
  } catch (error) {
    console.log(`[User Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

async function existsUserById(id) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return !!user;
  } catch (error) {
    console.log(`[User Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

async function updateUserFieldsById(data, id) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: true,
      },
    });

    return updatedUser;
  } catch (error) {
    console.log(`[User Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

async function updateUserVerification(email) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: {
        is_activated: true,
        verificationCode: null,
        codeExpiry: null,
      },
    });

    return user;
  } catch (error) {
    console.log(`[User Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

async function findUserByUserName(friendName) {
  try {
    const payload = await prisma.user.findMany({
      where: {
        name: {
          contains: friendName,
        },
      },
      take: 10,
      select: {
        id: true,
        name: true,
      },
    });

    return payload;
  } catch (error) {
    console.log(`[User Repository Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

module.exports = {
  getUserById,
  getUserByEmail,
  existsUserByEmail,
  createUser,
  existsUserById,
  deactivateUserById,
  updateUserFieldsById,
  findUserByUserName,
  updateUserVerification,
};
