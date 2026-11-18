import {
  CreatePostRequestDTO,
  EditPostRequestDTO,
  PostResponseDTO,
} from "../models/Post";

export interface IPostRepository {
  create(data: CreatePostRequestDTO): Promise<PostResponseDTO>;
  edit(data: EditPostRequestDTO): Promise<PostResponseDTO>;
  fetchPostByText(text: string): Promise<PostResponseDTO[]>;
  fetchAllByUserId(authorId: string): Promise<PostResponseDTO[]>;
  fetchPostByPostId(postId: string): Promise<PostResponseDTO>;
}
