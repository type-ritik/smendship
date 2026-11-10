import bcrypt from "bcrypt";

export class PasswordEncoder {
  constructor() {}

  hashing(raw: string): string {
    const saltRounds = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(raw, saltRounds);
    return hashedPassword;
  }

  comparing(raw: string, hashPassword: string): boolean {
    return bcrypt.compareSync(raw, hashPassword);
  }
}
