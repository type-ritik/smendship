import {
  CommentResponseDTO,
  CreateCommentDTO,
  EditCommentDTO,
} from "../models/Comment";
import { ICommentRepository } from "../repositories/ICommentRepository";

export class CommentService {
  constructor(private commentRepository: ICommentRepository) {}

  public async createComment(
    request: CreateCommentDTO,
  ): Promise<CommentResponseDTO> {
    return await this.commentRepository.create(request);
  }

  public async editComment(
    request: EditCommentDTO,
  ): Promise<CommentResponseDTO> {
    return await this.commentRepository.update(request);
  }

  public async deleteComment(id: string): Promise<{ response: string }> {
    return await this.commentRepository.delete(id);
  }

  public async fetchCommentsOfPost(
    postId: string,
  ): Promise<CommentResponseDTO[]> {
    return await this.commentRepository.getAllCommentByPostId(postId);
  }

  public fetchCommentOf(commentId: string): Promise<CommentResponseDTO | null> {
    return this.commentRepository.getCommentById(commentId);
  }
}
