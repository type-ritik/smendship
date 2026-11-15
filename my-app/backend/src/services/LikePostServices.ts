import {
  CreateLikePostDTO,
  EditLikePostDTO,
  LikePostResponseDTO,
} from "../models/LikePost";
import { ILikePostRepository } from "../repositories/ILikePostRepository";

export class LikePostService {
  constructor(private likePostRepository: ILikePostRepository) {}

  public async likeIt(
    request: CreateLikePostDTO,
  ): Promise<LikePostResponseDTO> {
    return await this.likePostRepository.create(request);
  }

  public async alterLike(
    request: EditLikePostDTO,
  ): Promise<LikePostResponseDTO> {
    return await this.likePostRepository.update(request);
  }

  public async removeLike(id: string): Promise<{ response: string }> {
    return await this.likePostRepository.delete(id);
  }

  public async fetchAllLikesOfPost(
    postId: string,
  ): Promise<LikePostResponseDTO[]> {
    return await this.likePostRepository.getAllLikesByPostId(postId);
  }

  public async fetchAllLikeByUser(
    userId: string,
  ): Promise<LikePostResponseDTO[]> {
    return await this.likePostRepository.getAllLikesByUserId(userId);
  }

  public async fetchPostLikesCount(postId: string): Promise<{ count: number }> {
    return await this.likePostRepository.getTotalLikesByPostId(postId);
  }
}
