import { ImageResponseDTO } from "../models/Images";

export interface IImageRepository {
  create(url: string, userId: string): Promise<ImageResponseDTO>;
  getById(id: string): Promise<ImageResponseDTO>;
  getAllByUserId(userId: string): Promise<ImageResponseDTO[]>;
}
