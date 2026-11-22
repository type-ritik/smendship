import {
  CreateUserDTO,
  UserResponseDTO,
  IUser,
  UpdateUserDTO,
  UpdateUserResponseDTO,
  ThirdPartyDTO,
  UserOTPResponseDTO,
  UserProfileResponseDTO,
} from "../models/User";

export interface IUserRepository {
  findById(id: string): Promise<UserResponseDTO | null>;
  findByEmail(email: string): Promise<UserResponseDTO | null>;
  isEmailExists(email: string): Promise<boolean>;
  create(data: CreateUserDTO): Promise<UserOTPResponseDTO>;
  delete(id: string): Promise<boolean>;
  update(data: UpdateUserDTO): Promise<UpdateUserResponseDTO>;
  createViaThirdParty(data: ThirdPartyDTO): Promise<UserResponseDTO>;
  confirmOTP(email: string): Promise<UserResponseDTO>;
  resetPassword(userId: string, password: string): Promise<UserResponseDTO>;
  extractData(userId: string): Promise<UserProfileResponseDTO>;
  findByName(name: string): Promise<UserResponseDTO[]>;
}
