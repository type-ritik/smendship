import { Mailer } from "../config/mailConfig";
import {
  githubAccessToken,
  githubEmailInfo,
  githubProfileInfo,
  oAuth2Client,
} from "../config/oAuthConfig";
import { PasswordEncoder } from "../config/PasswordEncoder";
import {
  AuthUserResponseDTO,
  UpdateUserDTO,
  UpdateUserResponseDTO,
  UserProfileResponseDTO,
} from "../models/User";
import { IUserRepository } from "../repositories/IUserRepository";
import { JwtToken } from "../utils/JwtToken";
import {
  generateExpiryTime,
  generateVerificationCode,
} from "../utils/OTPGeneratorUtils";
import { isValidEmail, isValidName, isValidPassword } from "../utils/UserUtils";

export class UserService {
  // Rely strictly on the interface contract, NOT the concrete class execution details
  private jwtToken = new JwtToken();
  private mailer = new Mailer();
  constructor(
    private userRepository: IUserRepository,
    private passwordEncoder: PasswordEncoder,
  ) {}

  public async retriveProfile(userId: string): Promise<UserProfileResponseDTO> {
    const user = await this.userRepository.extractData(userId);

    return user;
  }

  public async registerUser(
    name: string,
    email: string,
    password: string,
  ): Promise<{ status: string }> {
    if (!isValidName(name)) {
      throw new Error("Invalid Name! Please provide a valid name.");
    }

    if (!isValidEmail(email)) {
      throw new Error("Invalid Email! Please provide a valid email address.");
    }

    if (!isValidPassword(password)) {
      throw new Error("Invalid Password! Please provide a valid password.");
    }

    const existingUser = await this.userRepository.isEmailExists(email);
    if (existingUser) throw new Error("Email already taken");

    const hashedPassword = this.passwordEncoder.hashing(password);

    const OTP = generateVerificationCode();
    const otpExpireTime = generateExpiryTime();

    await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      verificationCode: OTP,
      codeExpiry: otpExpireTime,
    });

    const otpSend = await this.mailer.sendCode(email, OTP);

    if (!otpSend) throw new Error("Server Error");

    return {
      status: "OTP send.",
    };
  }

  public async verifyOTP(
    email: string,
    OTP: string,
  ): Promise<AuthUserResponseDTO> {
    try {
      // Retrive user data
      const newUser = await this.userRepository.findByEmail(email);
      const newDate = new Date();
      const date = new Date(newUser.codeExpiry);

      if (newDate > date) {
        throw new Error("Expired OTP. Try again!");
      }

      if (newUser.verificationCode.localeCompare(OTP)) {
        throw new Error("Invalid OTP. Try again!");
      }

      // Update user verification
      const user = await this.userRepository.confirmOTP(newUser.email);

      // Generate token
      const token = this.jwtToken.generate({ id: user.id, admin: false });

      if (!token) {
        console.log("Failed to generate token");
        throw new Error("Server error");
      }

      // Verification successful message -> email
      const sendMail = await this.mailer.sendSuccessMessage(user.email);

      if (!sendMail) {
        console.log("Failed to send email");
        throw new Error("Server error");
      }

      // Response
      return {
        user,
        token,
      };
    } catch (error) {
      console.log("[User Verification Error]:", error.message);
      throw error;
    }
  }

  public async requestForPasswordReset(
    userId: string,
  ): Promise<{ status: string }> {
    const user = await this.userRepository.findById(userId);
    const resetLink = `${process.env.CLIENT_API_URL}/${userId}/password_reset`;

    await this.mailer.sendResetPasswordLink(user.name, user.email, resetLink);

    return {
      status: "Reset password link send to your email.",
    };
  }

  public async resetPassword(
    userId: string,
    password: string,
  ): Promise<{ status: string }> {
    const hashedPassword = this.passwordEncoder.hashing(password);
    const user = await this.userRepository.resetPassword(
      userId,
      hashedPassword,
    );

    if (!user) {
      throw new Error("Failed to reset password. Please try again.");
    }

    return {
      status: "Password reset successful.",
    };
  }

  public async validateUser(
    email: string,
    password: string,
  ): Promise<AuthUserResponseDTO> {
    if (!isValidEmail(email)) {
      throw new Error("Invalid Email.");
    }

    if (!isValidPassword(password)) {
      throw new Error("Invalid Password.");
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (!existingUser) throw new Error("Email is not match");

    const validPassword = this.passwordEncoder.comparing(
      password,
      existingUser.password,
    );
    if (!validPassword) throw new Error("Password is not match.");

    const token = this.jwtToken.generate({ id: existingUser.id, admin: false });

    return {
      user: {
        ...existingUser,
      },
      token,
    };
  }

  public async updateProfile(
    data: UpdateUserDTO,
  ): Promise<UpdateUserResponseDTO> {
    if (!data.id) {
      throw new Error("Unauthorized user.");
    }

    if (!data.name && !data.email) {
      throw new Error(
        "Invalid input data. Please provide at least one field to update.",
      );
    }

    if (!isValidName(data.name)) {
      throw new Error("Invalid Name! Please provide a valid name.");
    }

    if (!isValidEmail(data.email)) {
      throw new Error("Invalid Email! Please provide a valid email address.");
    }

    return this.userRepository.update(data);
  }

  public async github(gitToken: string): Promise<AuthUserResponseDTO> {
    try {
      // Fetch the access token
      const accessToken = await githubAccessToken(gitToken);

      // Error github reject the code
      if (!accessToken) {
        throw new Error("Failed to retrieve access token from GitHub");
      }

      // Fetch public profile info
      const profileData = await githubProfileInfo(accessToken);
      console.log(profileData);

      // Primary email
      const primaryEmail = await githubEmailInfo(accessToken);
      console.log(primaryEmail);

      // insert user data
      const user = await this.userRepository.createViaThirdParty({
        name: profileData.name,
        email: primaryEmail,
        method: "github",
      });

      const token = this.jwtToken.generate({ id: user.id, admin: false });

      if (!token) {
        console.log("Failed to generate token.");
        throw new Error("Server failed to load.");
      }

      return {
        user,
        token,
      };
    } catch (error) {
      console.log("[GitHub Auth Error]:", error.message);
      throw new Error(error.message);
    }
  }

  public async google(googleToken: string): Promise<AuthUserResponseDTO> {
    try {
      // Get the tokens form the authorization code
      const { tokens } = await oAuth2Client.getToken(googleToken);

      oAuth2Client.setCredentials(tokens); // Set credentials for future requests

      if (tokens.id_token) {
        const ticket = await oAuth2Client.verifyIdToken({
          idToken: tokens.id_token,
          audience: process.env.GOOGLE_API_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const user = await this.userRepository.createViaThirdParty({
          name: payload.name,
          email: payload.email,
          method: "google",
        });

        const token = this.jwtToken.generate({ id: user.id, admin: false });

        if (!token) {
          throw new Error("Server error.");
        }

        return {
          user,
          token,
        };
      }
    } catch (error) {
      console.log("[Google Auth Error]:", error.message);
      throw new Error(error.message);
    }
  }
}
