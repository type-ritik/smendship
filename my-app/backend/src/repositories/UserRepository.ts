import { PrismaClient } from "@prisma/client";
import {
  CreateUserDTO,
  ThirdPartyDTO,
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

  async resetPassword(
    userId: string,
    password: string,
  ): Promise<UserResponseDTO> {
    try {
      const payload = await this.prisma.user.update({
        where: { id: userId },
        data: {
          password,
        },
      });

      return payload;
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
          status: true,
          role: true,
        },
      });

      return payload;
    } catch (error) {
      console.log("❌ Prisma query crashed:", error);
      throw error;
    }
  }

  async update(data: UpdateUserResponseDTO): Promise<UpdateUserResponseDTO> {
    try {
      const payload = await this.prisma.$transaction(async (tx) => {
        if (data.name && data.email) {
          return tx.user.update({
            where: {
              id: data.id,
            },
            data: {
              email: data.email,
              name: data.name,
            },
          });
        } else if (data.email) {
          return tx.user.update({
            where: {
              id: data.id,
            },
            data: {
              email: data.email,
            },
          });
        } else if (data.name) {
          return tx.user.update({
            where: {
              id: data.id,
            },
            data: {
              name: data.name,
            },
          });
        }

        return tx.user.findUnique({
          where: {
            id: data.id,
          },
        });
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

  async findByEmail(email: string): Promise<UserOTPResponseDTO | null> {
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

  async findByName(name: string): Promise<UserResponseDTO[]> {
    return this.prisma.user.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });
  }
}
