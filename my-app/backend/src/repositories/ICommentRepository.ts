import {
  CommentResponseDTO,
  CreateCommentDTO,
  EditCommentDTO,
} from "../models/Comment";

export interface ICommentRepository {
  create(request: CreateCommentDTO): Promise<CommentResponseDTO>;
  update(request: EditCommentDTO): Promise<CommentResponseDTO>;
  getAllCommentByPostId(postId: string): Promise<CommentResponseDTO[]>;
  getCommentById(id: string): Promise<CommentResponseDTO | null>;
  delete(id: string): Promise<{ response: string }>;
}
