const {
  sendVerificationCode,
  sendVerificationSuccessfullMessage,
} = require("../config/mailConfig");
const {
  oAuth2Client,
  githubProfileInfo,
  githubEmailInfo,
  githubAccessToken,
} = require("../config/oAuthConfig");
const { comparePassword, hashPassword } = require("../config/PasswordEncoder");
const {
  getUserByEmail,
  existsUserByEmail,
  createUser,
  findUserByUserName,
  updateUserVerification,
  createAuthAccount,
} = require("../repository/UserRepository");
const {
  generateVerificationCode,
  generateExpiryTime,
} = require("../utils/OTPGeneratorUtils");
const { generateToken } = require("./JwtServices");

// Creating new user account
async function createAccount(name, email, password) {
  try {
    // Email already exists
    const isUserExistsWithEmail = await existsUserByEmail(email);

    if (isUserExistsWithEmail) {
      throw new Error("Email already exists");
    }

    // Hashed password
    const hashedPassword = await hashPassword(password);

    if (!hashedPassword) {
      throw new Error("Failed to hash password");
    }

    // OTP create
    const verificationCode = generateVerificationCode();

    if (!verificationCode) {
      throw new Error("Failed to generate verification code");
    }

    // Create OTP expire time
    const codeExpiry = generateExpiryTime();

    if (!codeExpiry) {
      throw new Error("Failed to generate code expiry time");
    }

    // Create user
    const newUser = await createUser(
      name,
      email,
      hashedPassword,
      verificationCode,
      codeExpiry,
    );

    if (!newUser) {
      throw new Error("Failed to create user");
    }

    // OTP send -> email
    const sendVerifyingCode = await sendVerificationCode(
      email,
      verificationCode,
    );

    if (!sendVerifyingCode) {
      throw new Error("Server error during signup");
    }

    // Response
    return {
      status: 201,
      message: "User registered! Check your email for the verification code.",
    };
  } catch (error) {
    console.log(`[User SignUp Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

// OTP verification
async function verifyUserAccount(email, verificationCode) {
  try {
    // Retrive user data
    const user = await getUserByEmail(email);

    if (user.is_activated) {
      throw new Error("Account already verified");
    }

    if (user.verificationCode !== verificationCode) {
      throw new Error("Invalid verification code");
    }

    if (Date.now() > user.codeExpiry) {
      throw new Error("Verification code expired");
    }

    // Update user verification
    const updateVerification = await updateUserVerification(user.email);

    if (!updateVerification) {
      throw new Error("Failed to update user verification status");
    }

    // Generate token
    const token = generateToken(updateVerification.id, updateVerification.role);

    if (!token) {
      throw new Error("Failed to generate token");
    }

    // Verification successful message -> email
    const res = await sendVerificationSuccessfullMessage(
      updateVerification.email,
    );

    if (!res) {
      throw new Error("Failed to send verification success email");
    }

    // Response
    return {
      status: 200,
      message: "Account verified successfully!",
      token,
      user: {
        id: updateVerification.id,
        name: updateVerification.name,
        email: updateVerification.email,
      },
    };
  } catch (error) {
    console.log("[User Verification Error]:", error.message);
  }
}

async function githubAuth(token) {
  try {
    // Fetch the access token
    const accessToken = await githubAccessToken(token);

    // Error github reject the code
    if (!accessToken) {
      throw new Error("Failed to retrieve access token from GitHub");
    }

    // Fetch public profile info
    const profileData = await githubProfileInfo(accessToken);

    // Primary email
    const primaryEmail = await githubEmailInfo(accessToken);

    // insert user data
    const user = await createAuthAccount(
      profileData.name,
      primaryEmail,
      "github",
      profileData.id.toString(),
    );

    const myToken = generateToken(user.name, user.role);

    if (!myToken) {
      throw new Error("Failed to generate token");
    }

    return {
      status: 200,
      message: "GitHub authentication successful",
      token: myToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.log("[GitHub Auth Error]:", error.message);
    throw new Error(error.message);
  }
}

async function googleAuth(token) {
  try {
    // Get the tokens form the authorization code
    const { tokens } = await oAuth2Client.getToken(token);

    oAuth2Client.setCredentials(tokens); // Set credentials for future requests

    if (tokens.id_token) {
      const ticket = await oAuth2Client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_API_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      const users = await createAuthAccount(
        payload.name,
        payload.email,
        "google",
        payload.sub,
      );

      const token = generateToken(users.id, users.role);

      if (!token) {
        throw new Error("Failed to generate token");
      }

      return {
        status: 200,
        message: "Google authentication successful",
        token,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      };
    }

    return data;
  } catch (error) {
    console.log("[Google Auth Error]:", error.message);
    throw new Error(error.message);
  }
}

async function userLogin(email, password) {
  try {
    const user = await getUserByEmail(email);

    const isPasswordMatched = await comparePassword(password, user.password);

    if (!isPasswordMatched) {
      throw new Error("Invalid Password");
    }

    const token = generateToken(user.id, user.role);

    if (!token) {
      throw new Error("Failed to generate token");
    }

    return {
      status: 200,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.log(`[User Login Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

async function searchFriendByName(friendName) {
  try {
    const users = await findUserByUserName(friendName);
    return users;
  } catch (error) {
    console.log(`[User Search Error]: ${error.message}`);
    throw new Error(error.message);
  }
}

module.exports = {
  userLogin,
  createAccount,
  searchFriendByName,
  verifyUserAccount,
  googleAuth,
  githubAuth,
};
