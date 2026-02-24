const { comparePassword, hashPassword } = require("../config/PasswordEncoder");
const {
  getUserByEmail,
  existsUserByEmail,
  createUser,
} = require("../repository/UserRepository");
const { generateToken } = require("./JwtServices");

async function createAccount(name, email, password) {
  try {
    const isUserExistsWithEmail = await existsUserByEmail(email);

    if (isUserExistsWithEmail) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await hashPassword(password);

    if (!hashedPassword) {
      throw new Error("Failed to hash password");
    }

    const newUser = await createUser(name, email, hashedPassword);

    if (!newUser) {
      throw new Error("Failed to create user");
    }

    const token = generateToken(newUser.id, newUser.role);

    if (!token) {
      throw new Error("Failed to generate token");
    }

    return {
      token,
      user: newUser,
    };
  } catch (error) {
    console.log(`[User SignUp Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

async function userLogin(email, password) {
  try {
    // Simulate user login logic
    const isEmailExists = await existsUserByEmail(email);

    if (!isEmailExists) {
      throw new Error("Invalid Email");
    }

    const user = await getUserByEmail(email);

    const isPasswordMatched = await comparePassword(password, user.password);

    if (!isPasswordMatched) {
      throw new Error("Invalid Password");
    }

    if (user.status === "SUSPENDED") {
      throw new Error("User account is suspended");
    }

    const token = generateToken(user.id, user.role);

    if (!token) {
      throw new Error("Failed to generate token");
    }

    delete user.password;
    delete user.status;

    return {
      token,
      user,
    };
  } catch (error) {
    console.log(`[User Login Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

module.exports = {
  userLogin,
  createAccount,
};
