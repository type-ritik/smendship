// export interface IBaseRepository<T> {
//   find(id: string): Promise<T | null>;
//   findAll(): Promise<T[]>;
//   create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
//   update(id: string, item: Partial<T>): Promise<T | null>;
//   delete(id: string): Promise<boolean>;
// }

import { IImages } from "./Images";

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
  profileImageId: string | null;
  profileImage: IImages;
  createdAt: Date;
}

// Request payload shape for creating a user (Omits system-generated fields)
export type CreateUserDTO = Omit<
  IUser,
  "id" | "createdAt" | "role" | "status" | "profileImageId" | "profileImage"
>;

export type UpdateUserDTO = Omit<
  IUser,
  | "createdAt"
  | "password"
  | "role"
  | "status"
  | "verificationCode"
  | "codeExpiry"
  | "profileImageId"
  | "profileImage"
>;

// Response payload shape sent to the client (Hides sensitive credentials)
export type UserResponseDTO = Omit<
  IUser,
  | "password"
  | "role"
  | "verificationCode"
  | "codeExpiry"
  | "profileImageId"
  | "profileImage"
>;

export type UserStatusResponseDTO = Omit<
  IUser,
  | "password"
  | "role"
  | "verificationCode"
  | "codeExpiry"
  | "profileImageId"
  | "profileImage"
  | "email"
  | "name"
  | "createdAt"
>;

export type UpdateUserResponseDTO = Omit<
  IUser,
  | "createdAt"
  | "password"
  | "role"
  | "verificationCode"
  | "codeExpiry"
  | "profileImageId"
  | "status"
  | "profileImage"
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
  "createdAt" | "role" | "profileImageId" | "status"
>;

export type UserProfileResponseDTO = Omit<
  IUser,
  "password" | "verficationCode" | "codeExpiry"
>;
