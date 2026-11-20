import { PrismaClient } from "@prisma/client";
import { IPostImageRepository } from "./IPostImageRepository";
import { PostImageResponseDTO } from "../models/PostImages";

export class PostImageRepository implements IPostImageRepository {
  constructor(private prisma: PrismaClient) {}

  public async create(
    imageId: string,
    postId: string,
  ): Promise<PostImageResponseDTO> {
    try {
      return await this.prisma.postImages.create({
        data: {
          imageId,
          postId,
        },
      });
    } catch (error) {
      console.log("Post image database error", error.message);
      throw new Error("❌ Database error");
    }
  }

  public async getById(id: string): Promise<PostImageResponseDTO> {
    try {
      return await this.prisma.postImages.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      console.log("Post image database error", error.message);
      throw new Error("❌ Database error");
    }
  }

  public async getAllById(postId: string): Promise<PostImageResponseDTO[]> {
    try {
      return await this.prisma.postImages.findMany({
        where: {
          postId,
        },
      });
    } catch (error) {
      console.log("Post image database error", error.message);
      throw new Error("❌ Database error");
    }
  }
}
