import { PostImageResponseDTO } from "../models/PostImages";

export interface IPostImageRepository {
  create(imageId: string, postId: string): Promise<PostImageResponseDTO>;
  getById(id: string): Promise<PostImageResponseDTO>;
  getAllById(postId: string): Promise<PostImageResponseDTO[]>;
}
