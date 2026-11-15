import {
  CreateLikePostDTO,
  EditLikePostDTO,
  LikePostResponseDTO,
} from "../models/LikePost";

export interface ILikePostRepository {
  create(request: CreateLikePostDTO): Promise<LikePostResponseDTO>;
  update(request: EditLikePostDTO): Promise<LikePostResponseDTO>;
  delete(id: string): Promise<{ response: string }>;
  getAllLikesByPostId(postId: string): Promise<LikePostResponseDTO[]>;
  getAllLikesByUserId(userId: string): Promise<LikePostResponseDTO[]>;
  getTotalLikesByPostId(postId: string): Promise<{ count: number }>;
}
