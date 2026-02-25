const { prisma } = require("../config/prismaConfig");

async function createUser(name, email, password) {
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
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
    });

    return updatedUser;
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
};
