import jwt from "jsonwebtoken";

export class JwtToken {
  private SECRET: string;
  constructor() {
    this.SECRET = process.env.JWT_SECRET || "super-secret-key";
  }

  generate(payload: { id: string; admin: boolean }): string {
    return jwt.sign(payload, this.SECRET);
  }

  verify(token: string): any {
    return jwt.verify(token, this.SECRET);
  }
}
