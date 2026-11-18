import { PrismaClient } from "@prisma/client";
import { ICommentRepository } from "./ICommentRepository";
import {
  CreateCommentDTO,
  CommentResponseDTO,
  EditCommentDTO,
} from "../models/Comment";

export class CommentRepository implements ICommentRepository {
  constructor(private prisma: PrismaClient) {}

  async create(request: CreateCommentDTO): Promise<CommentResponseDTO> {
    try {
      return await this.prisma.comment.create({
        data: request,
      });
    } catch (error) {
      console.log("Comment database error: ", error);
      throw new Error("Database error");
    }
  }

  async update(request: EditCommentDTO): Promise<CommentResponseDTO> {
    try {
      return await this.prisma.comment.update({
        where: {
          id: request.id,
        },
        data: {
          comment: request.comment,
        },
      });
    } catch (error) {
      console.log("Comment database error: ", error);
      throw new Error("Database error");
    }
  }

  async getAllCommentByPostId(postId: string): Promise<CommentResponseDTO[]> {
    try {
      return await this.prisma.comment.findMany({
        where: {
          postId,
        },
      });
    } catch (error) {
      console.log("Comment database error: ", error);
      throw new Error("Database error");
    }
  }

  async getCommentById(id: string): Promise<CommentResponseDTO | null> {
    try {
      return await this.prisma.comment.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      console.log("Comment database error: ", error);
      throw new Error("Database error");
    }
  }

  async delete(id: string): Promise<{ response: string }> {
    try {
      const payload = await this.prisma.comment.delete({
        where: { id },
      });

      if (!payload) {
        throw new Error("Database error on deleting comment");
      }

      return {
        response: "Comment is removed successfully",
      };
    } catch (error) {
      console.log("Comment database error: ", error);
      throw new Error("Database error");
    }
  }
}
