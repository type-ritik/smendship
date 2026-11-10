import {
  CreatePostRequestDTO,
  EditPostRequestDTO,
  PostResponseDTO,
} from "../models/Post";
import { IPostRepository } from "../repositories/IPostRepository";
import { IUserRepository } from "../repositories/IUserRepository";

export class PostService {
  constructor(
    private postRepository: IPostRepository,
    private userRepository: IUserRepository,
  ) {}

  public async createPost(
    data: CreatePostRequestDTO,
  ): Promise<PostResponseDTO> {
    const author = await this.userRepository.findById(data.authorId);
    if (!author) throw new Error("❌ Unauthorized author");

    if (data.title.length < 10)
      throw new Error("Title must be 10 letters long");

    if (data.content.length < 10)
      throw new Error("Content must be 15 letters long");

    if (data.category.length < 1) throw new Error("Category can't be empty");

    const post = await this.postRepository.create(data);
    return post;
  }

  public async updatePost(data: EditPostRequestDTO): Promise<PostResponseDTO> {
    const post = await this.postRepository.fetchPostByPostId(data.id);

    if (!post) throw new Error("❌ Invalid postId");

    if (data.title.length < 10)
      throw new Error("Title must be 10 letters long");

    if (data.content.length < 10)
      throw new Error("Content must be 15 letters long");

    if (data.category.length < 1) throw new Error("Category can't be empty");

    const payload = await this.postRepository.edit(data);

    return payload;
  }

  public async searchPost(text: string): Promise<PostResponseDTO[]> {
    if (text.length < 1) return null;

    const payload = await this.postRepository.fetchPostByText(text);

    return payload;
  }

  public async retriveEntirePostsOfAuthor(
    authorId: string,
  ): Promise<PostResponseDTO[]> {
    const author = await this.userRepository.findById(authorId);
    if (!author) throw new Error("❌ Invalid user credentials");

    const payload = await this.postRepository.fetchAllByUserId(authorId);

    return payload;
  }

  public async retrivePostByPostId(postId: string): Promise<PostResponseDTO> {
    const payload = await this.postRepository.fetchPostByPostId(postId);

    if (!payload) throw new Error("❌ Invalid post credentials");

    return payload;
  }
}
