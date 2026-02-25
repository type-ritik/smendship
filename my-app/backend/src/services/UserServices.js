const { hashPassword } = require("../config/PasswordEncoder");
const {
  existsUserById,
  getUserById,
  deactivateUserById,
  existsUserByEmail,
  updateUserFieldsById,
} = require("../repository/UserRepository");
const { isValidName, isValidEmail, isValidPassword } = require("../utils/UserUtils");

const deleteUserById = async (id, userId, role) => {
  try {
    if (role !== "admin" && userId !== id) {
      throw new Error("Unauthorized resouce access");
    }

    const isUserExists = await existsUserById(id);

    if (!isUserExists) {
      throw new Error("User not found");
    }

    const user = await getUserById(id);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role === "ADMIN") {
      throw new Error("Unauthorized resouce access");
    }

    if (!user.is_activated) {
      throw new Error("Error Deactivating user");
    }

    const isUserDeactivated = await deactivateUserById(user.id);

    if (!isUserDeactivated) {
      throw new Error("Error Deactivating user");
    }

    return {
      status: "success",
      message: "User deactivated successfully",
    };
  } catch (error) {
    console.log(`[User Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

const updateUserProfile = async (inputData, id) => {
  try {
    const userExists = await existsUserById(id);
    if (!userExists) {
      throw new Error("User not found");
    }

    const user = await getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.is_activated) {
      throw new Error("User account is deactivated");
    }

    if (user.status === "SUSPENDED") {
      throw new Error("User account is suspended");
    }

    const data = {};

    if (inputData.name) {
      if (user.name === inputData.name) {
        throw new Error("Name is the same as the current name");
      }

      if (!isValidName(inputData.name)) {
        throw new Error(
          "Invalid Name! Name must be at least 3 characters long.",
        );
      }
      data["name"] = inputData.name;
    }

    if (inputData.email) {
      if (user.email === inputData.email) {
        throw new Error("Email is the same as the current email");
      }

      if (!isValidEmail(inputData.email)) {
        throw new Error("Invalid Email! Please provide a valid email address.");
      }

      const isEmailExists = await existsUserByEmail(inputData.email);

      if (isEmailExists) {
        throw new Error("Email already in use! Please use a different email.");
      }

      data["email"] = inputData.email;
    }

    if (inputData.password) {
      if (!isValidPassword(inputData.password)) {
        throw new Error(
          "Invalid Password! Password must be at least 8 characters long.",
        );
      }

      const hashedPassword = await hashPassword(inputData.password);

      if (!hashedPassword) {
        throw new Error("Error hashing password");
      }

      data["password"] = hashedPassword;
    }

    const userFieldUpdated = await updateUserFieldsById(data, user.id);

    if (!userFieldUpdated) {
      throw new Error("Error updating user profile");
    }

    return {
      status: "success",
      message: "User profile updated successfully",
      user: {
        id: userFieldUpdated.id,
        name: userFieldUpdated.name,
        email: userFieldUpdated.email,
      },
      lastUpdated: Date.now().toString(),
    };
  } catch (error) {
    console.log(`[User Service Error]: ${error.message}`);
    throw new Error(error.message);
  }
};

module.exports = { deleteUserById, updateUserProfile };
