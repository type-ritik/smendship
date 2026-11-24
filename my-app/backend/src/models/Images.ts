import { IPostImages } from "./PostImages";
import { UserResponseDTO } from "./User";

export interface IImages {
  id: string;
  url: string;
  uploadedAt: Date;
  userId: string;
  user: UserResponseDTO;
  postImages: IPostImages;
}


// Image Response DTO
export type ImageResponseDTO = Omit<IImages, "user" | "postImages">;
