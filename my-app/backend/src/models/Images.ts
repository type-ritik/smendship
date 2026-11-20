import { IPostImages } from "./PostImages";
import { IUser } from "./User";

export interface IImages {
  id: string;
  url: string;
  uploadedAt: Date;
  userId: string;
  user: IUser;
  postImages: IPostImages;
}


// Image Response DTO
export type ImageResponseDTO = Omit<IImages, "user" | "postImages">;
