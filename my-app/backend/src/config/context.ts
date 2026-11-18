import { Request, Response } from "express";
import { JwtToken } from "../utils/JwtToken";

const jwtToken = new JwtToken();

// Context function to provide context to resolvers

export const getContext = async (req: Request, res: Response) => {
  const token = req.headers.authorization || null;

  if (!token) {
    return { user: null };
  }

  try {
    const user = jwtToken.verify(token);

    return {
      user, // Current authenticated user
      req,
    };
  } catch (error) {
    return { user: null };
  }
};
