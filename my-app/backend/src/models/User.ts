// export interface IBaseRepository<T> {
//   find(id: string): Promise<T | null>;
//   findAll(): Promise<T[]>;
//   create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
//   update(id: string, item: Partial<T>): Promise<T | null>;
//   delete(id: string): Promise<boolean>;
// }

// Core database entity shape
export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string | null;
  status: string | null;
  verificationCode: string | null;
  codeExpiry: Date | null;
  profile_image: string | null;
  createdAt: Date;
}

// Request payload shape for creating a user (Omits system-generated fields)
export type CreateUserDTO = Omit<
  IUser,
  "id" | "createdAt" | "role" | "status" | "profile_image"
>;

export type UpdateUserDTO = Omit<
  IUser,
  | "createdAt"
  | "password"
  | "role"
  | "status"
  | "verificationCode"
  | "codeExpiry"
  | "profile_image"
>;

// Response payload shape sent to the client (Hides sensitive credentials)
export type UserResponseDTO = Omit<
  IUser,
  | "password"
  | "role"
  | "status"
  | "verificationCode"
  | "codeExpiry"
  | "profile_image"
>;

export type UpdateUserResponseDTO = Omit<
  IUser,
  | "createdAt"
  | "password"
  | "role"
  | "verificationCode"
  | "codeExpiry"
  | "profile_image"
  | "status"
>;

export type AuthUserResponseDTO = {
  user: UserResponseDTO;
  token: string;
};

export type ThirdPartyDTO = {
  name: string;
  email: string;
  method: string;
};

export type UserOTPResponseDTO = Omit<
  IUser,
  "createdAt" | "role" | "profile_image" | "status"
>;

export type UserProfileResponseDTO = Omit<
  IUser,
  "password" | "verficationCode" | "codeExpiry"
>;
