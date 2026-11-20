import { PrismaClient } from "@prisma/client";
import { IImageRepository } from "./IImageRepository";
import { ImageResponseDTO } from "../models/Images";

export class ImageRepository implements IImageRepository {
  constructor(private prisma: PrismaClient) {}

  public async create(url: string, userId: string): Promise<ImageResponseDTO> {
    try {
      return await this.prisma.images.create({
        data: {
          userId,
          url,
        },
      });
    } catch (error) {
      console.log("Image repository error", error.message);
      throw new Error("❌ Database Error");
    }
  }

  public async getById(id: string): Promise<ImageResponseDTO> {
    try {
      return await this.prisma.images.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      console.log("Image repository error", error.message);
      throw new Error("❌ Database Error");
    }
  }

  public async getAllByUserId(userId: string): Promise<ImageResponseDTO[]> {
    try {
      return await this.prisma.images.findMany({
        where: {
          userId,
        },
      });
    } catch (error) {
      console.log("Image repository error", error.message);
      throw new Error("❌ Database Error");
    }
  }
}
