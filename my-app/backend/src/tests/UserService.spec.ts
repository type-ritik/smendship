import { describe, it, expect, vi } from "vitest";
import { UserService } from "../services/UserService";
import { IUserRepository } from "../repositories/IUserRepository";
import { PasswordEncoder } from "../config/PasswordEncoder";

describe("User service - Register Logic", () => {
  it("should throw an application error if the email address is already take", async () => {
    const mockUserRepository = {
      isEmailExists: vi.fn().mockResolvedValue(true),
      findByEmail: vi
        .fn()
        .mockResolvedValue({
          id: "23b7b5c1-b658-422c-ae1f-1097e59ac540",
          email: "mihauk@gmail.com",
        }),
      create: vi.fn(),
    } as unknown as IUserRepository;

    const mockPasswordHasher = {
      hash: vi
        .fn()
        .mockResolvedValue(
          "$2b$10$Zy6YfkYqLc8K2QhXexXykOmGQu.88xGxIYEThISa.AeJDtafNW8jO",
        ),
    } as unknown as PasswordEncoder;

    const userService = new UserService(mockUserRepository, mockPasswordHasher);

    await expect(
      userService.registerUser("Dev", "mihauk@gmail.com", "ritik09p123"),
    ).rejects.toThrow("Email already taken");
  });
});
