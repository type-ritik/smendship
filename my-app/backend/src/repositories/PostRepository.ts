import { PrismaClient } from "@prisma/client";
import {
  CreatePostRequestDTO,
  EditPostRequestDTO,
  PostResponseDTO,
} from "../models/Post";

export class PostRepository {
  private prisma: PrismaClient;
  private pageSize: number = 10;

  constructor(dbPrisma: PrismaClient) {
    this.prisma = dbPrisma;
  }

  public async create(data: CreatePostRequestDTO): Promise<PostResponseDTO> {
    try {
      const payload = await this.prisma.post.create({
        data: {
          title: data.title,
          content: data.content,
          authorId: data.authorId,
          category: data.category,
        },
        include: {
          author: true,
        },
      });

      return payload;
    } catch (error) {
      console.log(error.message);
      throw new Error(`❌ Database query crashed`);
    }
  }

  public async edit(data: EditPostRequestDTO): Promise<PostResponseDTO> {
    try {
      const payload = await this.prisma.post.update({
        where: {
          id: data.id,
        },
        data: {
          title: data.title,
          content: data.content,
          category: data.category,
        },
        include: {
          author: true,
        },
      });

      return payload;
    } catch (error) {
      console.log(error.message);
      throw new Error(`❌ Database query crashed`);
    }
  }

  public async fetchPostByPostId(postId: string): Promise<PostResponseDTO> {
    try {
      const payload = await this.prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: true,
        },
      });

      return payload;
    } catch (error) {
      console.log(error.message);
      throw new Error(`❌ Database query crashed`);
    }
  }

  public async fetchAllByUserId(authorId: string): Promise<PostResponseDTO[]> {
    try {
      const payload = await this.prisma.post.findMany({
        where: {
          authorId,
        },
        include: {
          author: true,
        },
      });

      return payload;
    } catch (error) {
      console.log(error.message);
      throw new Error(`❌ Database query crashed`);
    }
  }

  public async fetchPostByText(text: string): Promise<PostResponseDTO[]> {
    try {
      const payload = await this.prisma.post.findMany({
        where: {
          OR: [
            {
              title: {
                contains: text,
                mode: "insensitive",
              },
            },
            {
              content: {
                contains: text,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          author: true,
        },
      });

      return payload;
    } catch (error) {
      console.log(error.message);
      throw new Error(`❌ Database query crashed`);
    }
  }

  public async fetchAllCursorBasePosts(
    lastPostId: string,
  ): Promise<{ posts: PostResponseDTO[]; nextCursor: string }> {
    try {
      const posts = await this.prisma.post.findMany({
        take: this.pageSize,
        ...(lastPostId && {
          skip: 1,
          cursor: {
            id: lastPostId,
          },
        }),
        orderBy: {
          id: "desc",
        },
        include: {
          author: true,
        },
      });

      const nextCursor =
        posts.length === this.pageSize ? posts[posts.length - 1].id : null;

      return { posts, nextCursor };
    } catch (error) {
      console.log("Post error", error.message);
      throw new Error("❌ Database query crashed");
    }
  }
}
