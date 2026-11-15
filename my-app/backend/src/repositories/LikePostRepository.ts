import { PrismaClient } from "@prisma/client";
import { ILikePostRepository } from "./ILikePostRepository";
import {
  CreateLikePostDTO,
  EditLikePostDTO,
  LikePostResponseDTO,
} from "../models/LikePost";

export class LikePostRepository implements ILikePostRepository {
  constructor(private prisma: PrismaClient) {}

  async create(request: CreateLikePostDTO): Promise<LikePostResponseDTO> {
    try {
      const payload = await this.prisma.postLike.create({
        data: {
          userId: request.userId,
          postId: request.postId,
          is_liked: request.isLiked,
        },
      });

      return {
        isLiked: payload.is_liked,
        ...payload,
      };
    } catch (error) {
      console.log("Like Post database error", error);
      throw new Error("❌ Database Error");
    }
  }

  async update(request: EditLikePostDTO): Promise<LikePostResponseDTO> {
    try {
      const payload = await this.prisma.postLike.update({
        where: {
          id: request.id,
        },
        data: {
          is_liked: request.isLiked,
        },
      });

      return {
        isLiked: payload.is_liked,
        ...payload,
      };
    } catch (error) {
      console.log("Like Post database error", error);
      throw new Error("❌ Database Error");
    }
  }

  async delete(id: string): Promise<{ response: string }> {
    try {
      const payload = await this.prisma.postLike.delete({
        where: { id },
      });

      if (!payload) throw new Error("Database error");

      return { response: "Like is removed successfully" };
    } catch (error) {
      console.log("Like Post database error", error);
      throw new Error("❌ Database Error");
    }
  }

  async getAllLikesByPostId(postId: string): Promise<LikePostResponseDTO[]> {
    try {
      const payload = await this.prisma.postLike.findMany({
        where: {
          postId,
        },
      });

      return payload.map((like) => ({ isLiked: like.is_liked, ...like }));
    } catch (error) {
      console.log("Like Post database error", error);
      throw new Error("❌ Database Error");
    }
  }

  async getAllLikesByUserId(userId: string): Promise<LikePostResponseDTO[]> {
    try {
      const payload = await this.prisma.postLike.findMany({
        where: {
          userId,
        },
      });

      return payload.map((like) => ({ isLiked: like.is_liked, ...like }));
    } catch (error) {
      console.log("Like Post database error", error);
      throw new Error("❌ Database Error");
    }
  }

  async getTotalLikesByPostId(postId: string): Promise<{ count: number }> {
    try {
      const count = await this.prisma.postLike.count({
        where: {
          postId,
        },
      });

      return { count };
    } catch (error) {
      console.log("Like Post database error", error);
      throw new Error("❌ Database Error");
    }
  }
}
