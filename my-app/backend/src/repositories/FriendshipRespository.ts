import { PrismaClient } from "@prisma/client";
import { IFriendshipRepository } from "./IFriendshipRepository";
import {
  CreateFriendshipDTO,
  FriendshipResponseDTO,
} from "../models/Friendship";

export class FriendshipRepository implements IFriendshipRepository {
  constructor(private prisma: PrismaClient) {}

  async createFriendship(
    data: CreateFriendshipDTO,
  ): Promise<{ response: string }> {
    try {
      const payload = await this.prisma.friendship.create({
        data: {
          follower: data.follower,
          following: data.following,
        },
      });

      return {
        response: `Friendship created successfully.`,
      };
    } catch (error) {
      console.log("Friendship database error", error);
      throw new Error("❌ Database error");
    }
  }

  async getFollowersList(
    userId: string,
  ): Promise<FriendshipResponseDTO[] | null> {
    try {
      const payload = await this.prisma.friendship.findMany({
        where: {
          following: userId,
        },
        include: {
          followers: true,
          followings: true,
        },
      });

      return payload;
    } catch (error) {
      console.log("Friendship database error", error);
      throw new Error("❌ Database error");
    }
  }

  async getFollowingsList(
    userId: string,
  ): Promise<FriendshipResponseDTO[] | null> {
    try {
      const payload = await this.prisma.friendship.findMany({
        where: {
          follower: userId,
        },
        include: {
          followers: true,
          followings: true,
        },
      });

      return payload;
    } catch (error) {
      console.log("Friendship database error", error);
      throw new Error("❌ Database error");
    }
  }

  async getCountOfFollowers(userId: string): Promise<{ count: number }> {
    try {
      const payload = await this.prisma.friendship.count({
        where: {
          following: userId,
        },
      });

      return {
        count: payload,
      };
    } catch (error) {
      console.log("Friendship database errror", error);
      throw new Error("❌ Database error");
    }
  }

  async getCountOfFollowings(userId: string): Promise<{ count: number }> {
    try {
      const payload = await this.prisma.friendship.count({
        where: {
          follower: userId,
        },
      });

      return {
        count: payload,
      };
    } catch (error) {
      console.log("Friendship database errror", error);
      throw new Error("❌ Database error");
    }
  }
}
