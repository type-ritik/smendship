import { IImages } from "./Images";
import { IPost } from "./Post";

export interface IPostImages {
  id: string;
  imageId: string;
  postId: string;
  postedAt: Date;
  post: IPost;
  image: IImages;
}

// PostImages Response DTO
export type PostImageResponseDTO = Omit<IPostImages, "post" | "image">;
