import { Request } from "express";
import { UserService } from "../services/UserService";
import { PostService } from "../services/PostService";

export interface GraphQLContext {
  user: {
    id: string;
    admin: boolean;
  };
  req: Request;
  services: {
    user: UserService;
    post: PostService;
    // Add new services here down the row
  };
}
