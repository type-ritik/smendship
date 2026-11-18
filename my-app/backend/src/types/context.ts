import { Request } from "express";
import { appServices } from "../config/container";

export interface GraphQLContext {
  user: {
    id: string;
    admin: boolean;
  };
  req: Request;
  services: typeof appServices
}
