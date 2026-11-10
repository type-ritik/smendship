import { PrismaClient } from "@prisma/client";
import {
  CreateUserDTO,
  IUser,
  ThirdPartyDTO,
  UpdateUserDTO,
  UpdateUserResponseDTO,
  UserOTPResponseDTO,
  UserProfileResponseDTO,
  UserResponseDTO,
} from "../models/User";
import { IUserRepository } from "./IUserRepository";

export class UserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor(dbPrisma: PrismaClient) {
    this.prisma = dbPrisma;
  }

  async extractData(userId: string): Promise<UserProfileResponseDTO> {
    try {
      const payload = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      return payload;
    } catch (error) {
      console.log("❌ Prisma query crashed:", error);
      throw error;
    }
  }

  async resetPassword(userId: string, password: string): Promise<boolean> {
    try {
      const payload = await this.prisma.user.update({
        where: { id: userId },
        data: {
          password,
        },
      });

      return !!payload;
    } catch (error) {
      console.log("❌ Prisma query crashed:", error);
      throw error;
    }
  }

  async confirmOTP(email: string): Promise<UserResponseDTO> {
    try {
      const payload = await this.prisma.user.update({
        where: { email },
        data: {
          verificationCode: null,
          codeExpiry: null,
        },
      });

      return payload;
    } catch (error) {
      console.log("❌ Prisma query crashed:", error);
      throw error;
    }
  }

  async createViaThirdParty(data: ThirdPartyDTO): Promise<UserResponseDTO> {
    try {
      const payload = await this.prisma.user.upsert({
        where: {
          email: data.email,
        },
        update: {},
        create: {
          name: data.name,
          email: data.email,
          auth_method: data.method,
          is_activated: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });

      return payload;
    } catch (error) {
      console.log("❌ Prisma query crashed:", error);
      throw error;
    }
  }

  async update(data: UpdateUserDTO): Promise<UpdateUserResponseDTO> {
    try {
      const payload = await this.prisma.user.update({
        where: {
          id: data.id,
        },
        data: {
          name: data.name,
          email: data.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
        },
      });

      return payload;
    } catch (error) {
      console.log("❌ Prisma query crashed:", error);
      throw error;
    }
  }

  async isEmailExists(email: string): Promise<boolean> {
    try {
      const payload = await this.prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });

      return !!payload;
    } catch (error) {
      console.error("❌ Prisma query crashed:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<UserResponseDTO | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.prisma.user.deleteMany({
      where: { id },
    });
    return result.count > 0;
  }

  async create(data: CreateUserDTO): Promise<UserOTPResponseDTO> {
    const payload = await this.prisma.user.create({
      data: {
        name: data.name,
        password: data.password,
        email: data.email,
        is_activated: false,
        verificationCode: data.verificationCode,
        codeExpiry: data.codeExpiry,
      },
    });

    return payload;
  }
}

// async function createAuthAccount(name, email, auth_method, auth_id) {
//   try {
//     const user = await prisma.user.upsert({
//       where: {
//         email,
//       },
//       update: {},
//       create: {
//         name,
//         email,
//         auth_method,
//         auth_method_id: auth_id,
//         is_activated: true,
//         verificationCode: null,
//         codeExpiry: null,
//       },
//     });

//     return user;
//   } catch (error) {
//     console.log("[Google Auth Account Error]:", error.message);
//     throw new Error(error.message);
//   }
// }

// async function createUser(name, email, password, verificationCode, codeExpiry) {
//   try {
//     const newUser = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password,
//         verificationCode,
//         codeExpiry,
//         is_activated: false,
//       },
//     });

//     return newUser;
//   } catch (error) {
//     console.log(`[User Repository Error]: ${error.message}`);
//     throw new Error(error.message);
//   }
// }

// async function deactivateUserById(id) {
//   try {
//     const deactivatedUser = await prisma.user.update({
//       where: { id },
//       data: {
//         is_activated: false,
//       },
//     });

//     return !!deactivateUserById;
//   } catch (error) {
//     console.log(`[User Repository Error]: ${error.message}`);
//     throw new Error(error.message);
//   }
// }

// async function getUserById(id) {
//   try {
//     const user = await prisma.user.findFirst({
//       where: { id },
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         codeExpiry: true,
//         verificationCode: true,
//       },
//     });

//     if (!user) {
//       throw new Error("User not found");
//     }

//     return user;
//   } catch (error) {
//     console.log(`[User Repository Error]: ${error.message}`);
//     throw new Error(error.message);
//   }
// }

// async function getUserByEmail(email) {
//   try {
//     const user = await prisma.user.findUnique({
//       where: {
//         email,
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//         password: true,
//         is_activated: true,
//         verificationCode: true,
//         codeExpiry: true,
//       },
//     });

//     if (!user) {
//       throw new Error("Invalid credentials. Check your email");
//     }

//     return user;
//   } catch (error) {
//     console.log(`[User Repository Error]: ${error.message}`);
//     throw new Error(error.message);
//   }
// }

// async function existsUserByEmail(email) {
//   try {
//     const user = await prisma.user.findUnique({
//       where: {
//         email,
//       },
//     });

//     return !!user;
//   } catch (error) {
//     console.log(`[User Repository Error]: ${error.message}`);
//     throw new Error(error.message);
//   }
// }

// async function existsUserById(id) {
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id },
//     });

//     return !!user;
//   } catch (error) {
//     console.log(`[User Repository Error]: ${error.message}`);
//     throw new Error(error.message);
//   }
// }

// async function updateUserFieldsById(data, id) {
//   try {
//     const updatedUser = await prisma.user.update({
//       where: { id },
//       data,
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         createdAt: true,
//         role: true,
//       },
//     });

//     return updatedUser;
//   } catch (error) {
//     console.log(`[User Repository Error]: ${error.message}`);
//     throw new Error(error.message);
//   }
// }

// async function updateUserVerification(email) {
//   try {
//     const user = await prisma.user.update({
//       where: { email },
//       data: {
//         is_activated: true,
//         verificationCode: null,
//         codeExpiry: null,
//       },
//     });

//     return user;
//   } catch (error) {
//     console.log(`[User Repository Error]: ${error.message}`);
//     throw new Error(error.message);
//   }
// }

// async function findUserByUserName(friendName) {
//   try {
//     const payload = await prisma.user.findMany({
//       where: {
//         name: {
//           contains: friendName,
//         },
//       },
//       take: 10,
//       select: {
//         id: true,
//         name: true,
//       },
//     });

//     return payload;
//   } catch (error) {
//     console.log(`[User Repository Error]: ${error.message}`);
//     throw new Error(error.message);
//   }
// }

// async function updateUserPassword(userId, password) {
//   try {
//     const user = await prisma.user.update({
//       where: {
//         id: userId,
//       },
//       data: {
//         password,
//       },
//       select: {
//         id: true,
//       },
//     });

//     return !!user;
//   } catch (error) {
//     console.log(`[User Repository Error]: ${error.message}`);
//     throw new Error(error.message);
//   }
// }

// module.exports = {
//   getUserById,
//   getUserByEmail,
//   existsUserByEmail,
//   createUser,
//   existsUserById,
//   deactivateUserById,
//   updateUserFieldsById,
//   findUserByUserName,
//   updateUserVerification,
//   createAuthAccount,
//   updateUserPassword,
// };
